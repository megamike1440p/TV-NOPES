const flash = require('express-flash');
const session = require('express-session');
const express = require('express');

const middleware = {
    loginRequired: function(req, res, next) {
      if (req.isAuthenticated()) {
        next();
      } else {
        req.session.flash = {
          type: 'danger',
          intro: "Login Required",
          message: 'You need to login to access these features.'
      };
        res.redirect("/login");
      }
    },
  
    populateFormData: function(req, res, next) {
      res.locals.user = req.user;
      next();
    },

    flashMessages: function(req, res, next) {
        // if there's a flash message, transfer
        // it to the context, then clear it
        res.locals.flash = req.session.flash;
        delete req.session.flash;
        next();
    }
  };

  module.exports = middleware;