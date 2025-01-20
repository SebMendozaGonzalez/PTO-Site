const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = () => {
    return createProxyMiddleware({
        target: process.env.APIMS_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/quantumhr', // Adjust the path for APIMS
        },
        onProxyReq: (proxyReq, req) => {
            
            // Log the original request path and rewritten path
            console.log('[Debug: Proxy Middleware] Forwarding request:', req.method, req.originalUrl);
            console.log('[Debug: Proxy Middleware] Target:', process.env.APIMS_BASE_URL);
            console.log('[Debug: Proxy Middleware] Rewritten path for APIMS:', proxyReq.path);


            // Add subscription key to the headers
            const subscriptionKey = process.env.REACT_APP_APIMS_SUBSCRIPTION_KEY;
            if (subscriptionKey) {
                proxyReq.setHeader('Ocp-Apim-Subscription-Key', subscriptionKey);
                console.log('[Proxy] Subscription Key added to headers');
            } else {
                console.warn('[Proxy] Subscription Key is missing!');
            }

            // Handle request body (for POST/PUT requests)
            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
                console.log('[Proxy] Request body written:', bodyData);
            }
        },
        onProxyRes: (proxyRes, req, res) => {
            // Log the response status code from APIMS
            console.log('[Proxy Response] Status Code:', proxyRes.statusCode);

            // Log the response headers
            console.log('[Proxy Response] Headers:', proxyRes.headers);
        },
        onError: (err, req, res) => {
            // Log detailed proxy errors
            console.error('[Proxy Error] Error Message:', err.message);
            console.error('[Proxy Error] Request URL:', req.originalUrl);
            res.status(500).json({ error: 'Internal server error' });
        },
    });
};

module.exports = apiProxy;
