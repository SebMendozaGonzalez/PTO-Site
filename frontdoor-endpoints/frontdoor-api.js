const express = require('express');
const axios = require('axios');

const router = express.Router();



// Middleware: Add APIMS subscription key to outgoing requests
const addSubscriptionKey = (req, res, next) => {
  const subscriptionKey = process.env.REACT_APP_APIMS_SUBSCRIPTION_KEY; // Store this key in .env file
  if (!subscriptionKey) {
    console.error('[Proxy Middleware] Missing APIMS Subscription Key');
    return res.status(500).send('Internal Server Error: Missing APIMS Subscription Key');
  }
  req.headers['Ocp-Apim-Subscription-Key'] = subscriptionKey;
  next();
};

// Proxy logic for all routes under /api
router.all('/*', addSubscriptionKey, async (req, res) => {
  try {
    // Construct the APIMS URL
    const targetUrl = `${process.env.APIMS_BASE_URL}${req.originalUrl}`;

    console.log(`[Proxy Middleware] Forwarding request to: ${targetUrl}`);

    // Make the request to APIMS
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers, // Forward all headers, including the subscription key
      data: req.body, // Forward the request body
    });

    console.log(`[Proxy Middleware] Received response from APIMS: ${response.status}`);
    // Send the response back to the client
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('[Proxy Middleware] Error during request forwarding:', error.message);

    if (error.response) {
      // If APIMS responded with an error, forward it to the client
      console.error(`[Proxy Middleware] APIMS Response:`, error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else {
      // If no response from APIMS, send a generic error
      res.status(500).send('Internal Server Error: Unable to process the request');
    }
  }
});

module.exports = router;
