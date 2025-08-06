const cds = require('@sap/cds');
const express = require('express');
const path = require('path');
const xsenv = require('@sap/xsenv');
const passport = require('passport');
const { JWTStrategy } = require('@sap/xssec').v3;

if (process.env.NODE_ENV === 'production') {
    cds.once('bootstrap', (app) => {
      app.use(
        '/i18n',
        passport.initialize(),
        passport.authenticate(new JWTStrategy(xsenv.getServices({ xsuaa: { tag: 'xsuaa' } }).xsuaa), {
          session: false,
          failWithError: true,
        }),
        express.static(path.join(__dirname, '_i18n'), {
            maxAge: 31536000
        }),
      );
    });
} else {
    cds.once('bootstrap', (app) => {
        app.use(
          '/i18n',
          express.static(path.join(__dirname, '_i18n'), {
            maxAge: 31536000
        }),
        );
      });
}

module.exports = cds.server;