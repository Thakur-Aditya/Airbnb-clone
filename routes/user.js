const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { redirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get( userController.signup)
.post(wrapAsync(userController.saveNewUser));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

router.get("/logout", userController.logout);
module.exports = router;