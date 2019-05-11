import express = require('express');
import passportazure from 'passport-azure-ad';
import passport from 'passport';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';

import { SESSION_SECRET,PORT, URL_FRONTEND } from './util/secrets';
import passconfig from './config/passport';

const OIDCStrategy = passportazure.OIDCStrategy;

passport.serializeUser(function (user: any, done: any) {
  done(null, user.oid);
});

passport.deserializeUser(function (oid: any, done: any) {
  findByOid(oid, function (err: any, user: any) {
    done(err, user);
  });
});

var users: any = [];

var findByOid = function (oid: any, fn: any) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

passport.use(new OIDCStrategy({
  identityMetadata: passconfig.creds.identityMetadata,
  clientID: passconfig.creds.clientID,
  responseType: 'code id_token',
  responseMode: 'form_post',
  redirectUrl: passconfig.creds.redirectUrl,
  allowHttpForRedirectUrl: true,
  clientSecret: passconfig.creds.clientSecret,
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
  //clockSkew: 0
},
  function (iss: any, sub: any, profile: any, accessToken: any, refreshToken: any, done: any) {
    if (!profile.oid) {
      return done(new Error('No oid found'), null);
    }
    // asynchronous verification, for effect...
    process.nextTick(function () {
      findByOid(profile.oid, function (err: any, user: any) {
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
  }
));

// Create a new express application instance
const app: express.Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// CORS  
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', URL_FRONTEND);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
})

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
};

app.get('/islogin', function (req, res, next) {
  res.send(req.isAuthenticated());
  next();
});

app.get('/login',
function (req: any, res: any, next: any) {
  passport.authenticate('azuread-openidconnect',
    {
      failureRedirect: '/fail',
    }
  )(req, res, next);
},
function (req, res) {
  res.redirect('/');
});

app.post('/signin',
  function (req: any, res: any, next: any) {
    passport.authenticate('azuread-openidconnect',
      {
        failureRedirect: '/fail',
      }
    )(req, res, next);
  },
  function (req, res) {
    console.log('Datos de azure recibidos correctamente')
    res.redirect(URL_FRONTEND);
});

app.get('/account', ensureAuthenticated, function (req, res) {
  res.send(req.user);
});

app.get('/logout', function (req: any, res: any) {
  req.session.destroy(function (err: any) {
    req.logOut();
    res.redirect(passconfig.destroySessionUrl);
  });
});

app.use(
  express.static(path.join(__dirname, './../public'), {
    setHeaders(res) {
      res.setHeader('Cache-Control', 'public,no-cache');
    }
  })
);

app.get('/api', function (req, res) {
  res.send('Server is started!');
});

app.listen(PORT, function () {
  console.log('server start in port: '+ PORT);
  console.log('http://localhost:'+ PORT);
});