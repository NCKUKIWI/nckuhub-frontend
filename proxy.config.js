const PROXY_CONFIG = {
    '/api': {
        target: 'http://localhost:3000',
        secure: true,
        logLevel: 'debug',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
};
module.exports = PROXY_CONFIG;
