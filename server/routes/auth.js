module.exports = ({ app, passport }) => {
  const callback = (req) => {
    const host = req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    return `${protocol}://${host}/auth/google/callback`;
  };

  app.get("/auth/user", (req, res) => {
    const { user = {} } = req;
    res.send({ ...user, isAuthenticated: req.isAuthenticated() });
  });

  app.get("/auth/google", (req, res, next) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
      callbackURL: callback(req),
    })(req, res, next);
  });

  // the callback after google has authenticated the user
  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", {
      successRedirect: "/",
      callbackURL: callback(req),
    })(req, res, next);
  });

  app.get("/auth/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
