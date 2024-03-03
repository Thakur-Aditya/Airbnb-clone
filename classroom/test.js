const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser("SecretCode")); //middleware for parsing cookie
const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) =>{
  res.locals.successMessage = req.flash("success");
  res.locals.errorMessage = req.flash("fail");
  next();
})

app.get("/register", (req, res) => {
  let { name = "thakur saabh" } = req.query;
  req.session.name = name;
  if(req.session.name === "thakur saabh"){
    req.flash("fail" , "no one registered");
  }else{
    req.flash("success", "User Registered Successfully");
  }  
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", { name: req.session.name });
});


app.listen(3030, (req, res) => {
  console.log("listeinig");
});

// app.get("/", (req, res) => {
//   res.send("Hi I am root");
// });

// app.get("/getsignedcookie", (req, res) => {
//   res.cookie("made-in", "india", { signed: true });
//   res.send("cookies sent");
// });

// app.get("/cookies", (req, res) => {
//   res.cookie("name", "Aditya");
//   res.send("Maaza");
// });

// app.get("/verify", (req, res) => {
//   console.log(req.signedCookies);
//   res.send("Verified");
// });

// count karne ka maamla

// app.get("/count", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//     res.send(`you sent the request ${req.session.count} times`);
// });
