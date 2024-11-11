var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/User")
const bcrypt = require("bcrypt")

/* GET users listing. */
router.get('/', async function(req, res, next) {
  const {username} = req.params
  const user = await User.findOne({username:username})
  console.log(user)
  res.send(user);

});

router.post("/", async(req,res,next)=>{
  try {
    const user = await User.findOne({username: req.body.username})
    if(user) return res.status(400).json({message: "User with this username already exists"});

    bcrypt.genSalt(10, (err,salt) =>{
      if(err){
        throw new Error("Error with creating user");
      }
      const password = req.body.password
      bcrypt.hash(password, salt, async(err,hash) => {
      if(err){
        throw new Error("Error with creating user");
      }

        const user = await User.create(
          {
            username:req.body.username,
            password:hash,
            credits:10,
            isAdmin:false,
          }

        )
        if(!user) throw new Error("Error creating user");
        res.status(201).json({userId: user.id})
    } )

    })


  } catch (error) {
    console.log(error.message);
    res.status(500).json({message:error.message})
  }
})

module.exports = router;
