const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user_model");
const { SECRET_KEY } = require("../config");

router.post("/register", async (req, res) => {
    const body = req.body;
    let user = new User({ username: body.username, password: body.password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save()
      .then(() => {
        const jwtSecretKey = SECRET_KEY;
        const token = jwt.sign({ username: user.username }, jwtSecretKey);
        res.send(token);
        // res.status(200).send(`Created user with username: ${body.username}`);
      })
      .catch(err => {
        res.status(500).send(`Unable to create new user with username: ${body.username}`);
      });
});

router.post("/login", async (req,res) =>{
  try{
    let user = await User.findOne({username: req.body.username})
    if(!user){
      return res.status(500).send("Credentials are invalid");
    }
    let validpassword = await bcrypt.compare(req.body.password, user.password)
    if(!validpassword){
      return res.status(500).send("Credentials are invalid");
    }
    else{
      const secret = SECRET_KEY
      return res.status(200).json({token:secret})
    }w
  }
  catch(err){
    return res.status(500).send(err.message);
  }
});

// router.post("/auth/login", (req, res) => {
//   const body = req.body;
//   var User = new userModel({ username: body.name, password: body.password });
//   User.save({ username: body.name, password: body.password }), (err) => {
//     if(err) 
//     {
//       res.status(500).send(`Unable to create new user with username: ${body.name}`, err);
//     } else {

//     }
//   }
// });

module.exports = router;
