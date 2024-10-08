const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const usermodel = require("./models/user-model")
const postmodel = require("./models/post-model")
const jwt = require("jsonwebtoken")
const cookieparser = require("cookie-parser")
const path = require('path')

app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set("view engine", "ejs") 

app.get("/", function (req, res) {
  res.render("index")

})
app.get("/login", isloggedin, function (req, res) {
  res.render("login")

})

app.post("/register", async function (req, res) {
  let { name, username, email, password, age } = req.body

  let user = await usermodel.findOne({ email })
  if (user) return res.status(500).send("u are already registered")

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      let user = await usermodel.create({
        name,
        username,
        email,
        age,
        password: hash
      })
      let token = jwt.sign({ email: email, userid: user._id }, "secret")
      res.cookie("token", token)
      res.send("succcessfully Register")
    });
  });
})

app.post("/login", async function (req, res) {
 
  try{
    let { password, email } = req.body
    let user = await usermodel.findOne({ email });
    if (!user) return res.send("something went wrong")
  
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ email: email, userid: user._id }, "secret")
        res.cookie("token", token)
        res.status(200).send("welcome to your profile")
      }
      else res.redirect("/login")
    });
  }
  catch(err){
    res.status(500).send("something is not clear")
  }
  });

app.get("/logout", function (req, res) {
  res.cookie("token", "")
  res.redirect("/login")
})

function isloggedin(req, res, next) {
  if (req.cookies.token === "") res.render("login")
  else {
    let data = jwt.verify(req.cookies.token, "secret")
    req.user = data
    next();
  }
}

app.listen(3000)


