//imports
require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET

//models
// const User = require('../models/User');
const db = require('../models');
//get api/user/stest (public)
router.get('/test', (req, res)=> {
    res.json({msg: 'User endpoint OK'})
})

// post api/user/register (public)
router.post('/register', (req, res) => {
    //find user by email 
    db.User.findOne({ email: req.body.email})
    .then(user => {
        // if email already exists, send a 400 response.
        if (user) {
            return res.status(400).json({msg: 'Email already exists!'})
        } else {
            //create a new user
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            // salt and has th epass, then save the user
            bcrypt.genSalt(10, (error, salt) => {
                
                bcrypt.hash(newUser.password, salt, (error, hash) => {
                    
                    // change password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(error => console.log(error))
                })
            })
        }
    })
})

// post api/users/login (public)
router.post('/login', (req,res)=> {
    const email = req.body.email
    const password = req.body.password

    //find a user via email 
    db.User.findOne({ email })
    .then(user => {
        //if there's not a user
        console.log(user)
        if (!user) {
            res.status(400).json({msg: "User not found"})
        } else {
            // a user is found in the db
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                // check password for a match
                if (isMatch) {
                    console.log(isMatch)
                    // user match, send a json webtoken
                    //create a token payload
                    const payload = {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                    // sign token
                    jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`
                        });
                    });
                } else {
                    return res.status(400).json({msg: 'Email or Password is incorrect' })
                }
            })
        }
    })
})

// GET api/users/current (private)
router.get('/current', passport.authenticate('jwt', {session:false}), (req,res)=> {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router;