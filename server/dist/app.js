"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const passport_azure_ad_1 = __importDefault(require("passport-azure-ad"));
const passport_1 = __importDefault(require("passport"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_validator_1 = __importDefault(require("express-validator"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const secrets_1 = require("./util/secrets");
const passport_2 = __importDefault(require("./config/passport"));
const OIDCStrategy = passport_azure_ad_1.default.OIDCStrategy;
passport_1.default.serializeUser(function (user, done) {
    done(null, user.oid);
});
passport_1.default.deserializeUser(function (oid, done) {
    findByOid(oid, function (err, user) {
        done(err, user);
    });
});
var users = [];
var findByOid = function (oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.oid === oid) {
            return fn(null, user);
        }
    }
    return fn(null, null);
};
passport_1.default.use(new OIDCStrategy({
    identityMetadata: passport_2.default.creds.identityMetadata,
    clientID: passport_2.default.creds.clientID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: passport_2.default.creds.redirectUrl,
    allowHttpForRedirectUrl: true,
    clientSecret: passport_2.default.creds.clientSecret,
    validateIssuer: true,
    isB2C: false,
    issuer: '',
    //passReqToCallback: false,
    scope: '',
    loggingLevel: 'error',
    nonceLifetime: 0,
    nonceMaxAmount: 5,
    useCookieInsteadOfSession: true,
    cookieEncryptionKeys: [
        { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
        { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ],
}, function (iss, sub, profile, accessToken, refreshToken, done) {
    if (!profile.oid) {
        return done(new Error('No oid found'), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
        findByOid(profile.oid, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                // "Auto-registration"
                users.push(profile);
                return done(null, profile);
            }
            return done(null, user);
        });
    });
}));
// Create a new express application instance
const app = express();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_validator_1.default());
app.use(cookie_parser_1.default());
app.use(express_session_1.default({
    resave: true,
    saveUninitialized: true,
    secret: secrets_1.SESSION_SECRET
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
// CORS  
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', secrets_1.URL_FRONTEND);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
;
app.get('/islogin', function (req, res, next) {
    res.send(req.isAuthenticated());
    next();
});
app.get('/login', function (req, res, next) {
    passport_1.default.authenticate('azuread-openidconnect', {
        failureRedirect: '/fail',
    })(req, res, next);
}, function (req, res) {
    res.redirect('/');
});
app.post('/signin', function (req, res, next) {
    passport_1.default.authenticate('azuread-openidconnect', {
        failureRedirect: '/fail',
    })(req, res, next);
}, function (req, res) {
    console.log('Datos de azure recibidos correctamente');
    res.redirect(secrets_1.URL_FRONTEND);
});
app.get('/account', ensureAuthenticated, function (req, res) {
    res.send(req.user);
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        req.logOut();
        res.redirect(passport_2.default.destroySessionUrl);
    });
});
app.use(express.static(path_1.default.join(__dirname, './../public'), {
    setHeaders(res) {
        res.setHeader('Cache-Control', 'public,no-cache');
    }
}));
app.get('/api', function (req, res) {
    res.send('Server is started!');
});
app.listen(secrets_1.PORT, function () {
    console.log('server start in port: ' + secrets_1.PORT);
    console.log('http://localhost:' + secrets_1.PORT);
});
