const PROXY_CONFIG = {
    "/api": {
        "target": "https://nckuhub.com",
        "secure": true,
        "logLevel": "debug",
        "changeOrigin": true,
        "pathRewrite": {"^/api": ""},
    }
}
module.exports = PROXY_CONFIG;
