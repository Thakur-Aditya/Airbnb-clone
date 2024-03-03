const User = require("../models/user.js");

module.exports.signup = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.saveNewUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      email,
      username,
    });
    const regdUser = await User.register(newUser, password); //saving using passport
    req.login(regdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirect = res.locals.redirectUrl || "/listings";
  res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    //passport ka function hae jesse user logout ho jata hae
    if (err) {
      console.log(res.user);
    }
    req.flash("success", "User is logged out");
    res.redirect("/listings");
  });
};
