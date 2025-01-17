const { createProxyMiddleware } = require('http-proxy-middleware');

const apiProxy = () => {
    return createProxyMiddleware({
        target: process.env.APIMS_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
            '^/api': '/quantumhr', // Adjust the path for APIMS
        },
        onProxyReq: (proxyReq, req) => {
            console.log('Rewriting path to:', proxyReq.path);
            // Add subscription key to the headers
            proxyReq.setHeader('Ocp-Apim-Subscription-Key', process.env.REACT_APP_APIMS_SUBSCRIPTION_KEY);

            if (req.body) {
                const bodyData = JSON.stringify(req.body);
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
            }
        },
        onError: (err, req, res) => {
            console.error('Proxy error:', err.message);
            res.status(500).json({ error: 'Internal server error' });
        },
    });
};

module.exports = apiProxy;
