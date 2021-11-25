const PROXY_CONFIG = {
    "/api": {
        "target": "https://nckuhub.com",
        "secure": true,
        "logLevel": "debug",
        "changeOrigin": true,
        "pathRewrite": {"^/api": ""},
        "onProxyRes": function(pr, req, res) {
            console.log("pr header", pr.headers);
            console.log("req", req.session);
            console.log("res", res.session);
            if (pr.headers['set-cookie']) {
                const cookies = pr.headers['set-cookie'].map(cookie =>
                    cookie.replace(/;(\ )*secure/gi, '')
                );
                pr.headers['set-cookie'] = cookies;
            }
        },
    }
}
module.exports = PROXY_CONFIG;
