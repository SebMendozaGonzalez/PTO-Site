const express = require('express');
const axios = require('axios');

const router = express.Router();

// Middleware: Parse incoming JSON requests
router.use(express.json());

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

