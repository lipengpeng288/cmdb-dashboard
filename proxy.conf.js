// Proxy configuration file. See link for more information:
// https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md

const PROXY_CONFIG = [
    {
        context: [
            "/api/v1/machine",
            "/api/v1/machine_digest",
        ],
        target: "http://localhost:8080",
        secure: false
    }
]

module.exports = PROXY_CONFIG;