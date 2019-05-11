"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_1 = require("../util/secrets");
const passconfig = {
    creds: {
        identityMetadata: `https://login.microsoftonline.com/${secrets_1.TENANT}/.well-known/openid-configuration`,
        clientID: secrets_1.APP_ID,
        redirectUrl: `${secrets_1.HOST_URL}:${secrets_1.PORT}/signin`,
        clientSecret: secrets_1.APP_SECRET,
    },
    resourceURL: 'https://graph.windows.net',
    destroySessionUrl: `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${secrets_1.HOST_URL}:${secrets_1.PORT}`
};
exports.default = passconfig;
