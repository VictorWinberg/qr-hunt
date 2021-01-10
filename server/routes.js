const path = require('path');

module.exports = (app, passport, db) => {
    // route middleware to make sure
    const isLoggedIn = (req, res, next) => {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated()) return next();

        return res.sendStatus(401);
    };

    const callback = req => {
        const host = req.get('host');
        const protocol = req.headers['x-forwarded-proto'] || req.protocol;
        return `${protocol}://${host}/__/auth/google/callback`;
    };

    app.get('/__/auth/google', (req, res, next) => {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            callbackURL: callback(req),
        })(req, res, next);
    });

    // the callback after google has authenticated the user
    app.get('/__/auth/google/callback', (req, res, next) => {
        passport.authenticate('google', {
            successRedirect: '/',
            callbackURL: callback(req),
        })(req, res, next);
    });

    app.get('/__/logout', (req, res) => {
        req.logout();
        req.session = null;
        res.clearCookie('connect.sid');
        res.redirect('/');
    });

    app.get('/__/user', (req, res) => {
        res.send(req.user || {});
    });
};