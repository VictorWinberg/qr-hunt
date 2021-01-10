const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = (app, passport, { User, QRCode }) => {
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

    app.get('/__/qrcodes', (_, res) => {
        QRCode.getAll((err, qrcodes) => {
            if (err) return res.status(400).send(err);
            return res.send(qrcodes);
        });
    });

    app.post('/__/qrcodes', (_, res) => {
        QRCode.create({ uuid: uuidv4() }, (err, qrcode) => {
            if (err) return res.status(400).send(err);
            return res.send(qrcode);
        });
    });
};