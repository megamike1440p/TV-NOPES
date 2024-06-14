const User = require('../models/models');
const passport = require('passport');

const login = {
    login: (req, res) => {
        res.render('login');
    },

    processLogin: async (req, res, next) => {
        passport.authenticate("local", {
            successRedirect: '/',
            failureRedirect: '/login'
        })(req, res, next);

        req.session.flash = {
            type: 'danger',
            intro: "Login Failure",
            message: 'Your Username or Password does not match or exist'
        }
    },

    processLogout: (req, res) => {
        req.logout();
        req.session.flash = {
            type: 'success',
            intro: "You're logged out",
            message: 'You have been logged out.'
        };
        res.redirect('/login');
    }
};

const processNewUser = {
    processNewUser: (req, res, next) => {
        const { username, password } = req.body;
        const user = new User({ username: username });
        User.register(user, password, function (err, user) {
            if (err) {
                console.error(err);
                req.session.flash = {
                    type: 'danger',
                    intro: 'Registration Error',
                    message: err.message
                };
                res.render('login');
            } else {
                req.session.flash = {
                    type: 'success',
                    intro: 'Registration Success',
                    message: 'Your account has been created.'
                };
                res.redirect('/login');
            }
        });
    }
};

module.exports = {
    login,
    processNewUser
};