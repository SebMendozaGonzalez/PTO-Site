const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const router = express.Router();

// Middleware: Parse incoming JSON requests
router.use(express.json());

// Configure JWT validation
const tenantId = "33d1ad6a-c8e7-4be9-bd3b-9942f85502bf"; // Your Azure AD Tenant ID
const audience = "api://a564ad6f-c874-40c5-82c4-fbb412756468"; // Your API's client ID
const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;

// JWKS client for retrieving signing keys
const client = jwksClient({
  jwksUri,
});

// Retrieve signing key
const getSigningKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// JWT validation middleware
const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'No Bearer token provided in the Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  // Verify the token
  jwt.verify(
    token,
    getSigningKey,
    {
      audience,
      issuer: `https://sts.windows.net/${tenantId}/`,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        console.error('[JWT Middleware] Token validation error:', err.message);
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'Invalid or expired token.',
        });
      }

      console.log('[JWT Middleware] Token validated successfully:', decoded);
      req.user = decoded; // Attach decoded token to the request for downstream use
      next();
    }
  );
};

// Middleware: Add APIMS subscription key to outgoing requests
const addSubscriptionKey = (req, res, next) => {
  const subscriptionKey = process.env.REACT_APP_APIMS_SUBSCRIPTION_KEY; // Store securely in .env
  if (!subscriptionKey) {
    console.error('[Proxy Middleware] Missing APIMS Subscription Key');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'APIMS Subscription Key is not configured.',
    });
  }
  req.headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
  next();
};

// Apply JWT validation middleware to all routes under /back
router.use(validateToken);

// Proxy handler for all routes under /back
router.all('/*', addSubscriptionKey, async (req, res) => {
  try {
    // Validate APIMS Base URL
    const apimsBaseUrl = process.env.APIMS_BASE_URL;
    if (!apimsBaseUrl) {
      console.error('[Proxy Middleware] Missing APIMS Base URL');
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'APIMS Base URL is not configured.',
      });
    }

    // Construct target URL by removing the "/back" prefix
    const targetPath = req.originalUrl.replace('/back', '');
    const targetUrl = `${apimsBaseUrl}${targetPath}`;

    console.log(`[Proxy Middleware] Forwarding request to: ${targetUrl}`);

    // Prepare headers (exclude conflicting headers)
    const filteredHeaders = { ...req.headers };
    delete filteredHeaders['host'];
    delete filteredHeaders['content-length'];

    // Forward request to APIMS
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: {
        ...filteredHeaders,
        'Content-Type': req.headers['content-type'] || 'application/json', // Ensure content type is valid
      },
      data: req.body, // Forward request body
    });

    console.log(`[Proxy Middleware] Response from APIMS: ${response.status}`);

    // Relay response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy Middleware] Error during request forwarding:', error.message);

    if (error.response) {
      // Handle errors from APIMS
      console.error(`[Proxy Middleware] APIMS Error: ${error.response.status}`);
      return res.status(error.response.status).json(error.response.data);
    }

    // Handle unexpected server-side errors
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Unable to process the request at this time.',
    });
  }
});

module.exports = router;
