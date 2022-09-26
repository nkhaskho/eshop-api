
const express = require("express");
const { User } = require("../models/user");
const Jwt = require("jsonwebtoken");
const Bcrypt = require("bcrypt");

const router = express.Router();

router.post('/login', (req, res) => {
    // #swagger.tags = ['auth']
    // #swagger.description = 'Get auth token.'
    User.find({username: req.body.username}, async (err, users) => {
        if (err) { res.status(404).send({error: "Invalid username or password"}) } 
        if (users.length>0) {
            let validCredentials = await Bcrypt.compare(req.body.password, users[0].password)
            if (!validCredentials) { res.status(400).json({error: "Invalid username or password"}) }
            else {
                let token = Jwt.sign({
                        id: users[0]._id,
                        role: users[0].role,
                        username: users[0].username
                    }, 
                    process.env.JWT_SECRET,
                    { expiresIn: '30d' }
                ); 
                res.status(200).json({
                    token: token, 
                    id: users[0]._id,
                    username: users[0].username,
                    fullName: users[0].fullName
                })
            }
        } else res.status(400).json({error: "Invalid username or password"})
          
    })
})


// Add new user
router.post("/signup", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Add new user.'
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({error: error.details[0].message}); //[0].message
        User.find({username: req.body.username}, async (err, users) => {
            if (err) { res.status(500).send({error: err}) }
            if (users.length>0) { res.status(400).send({error: "username already exist"}) }
            const user = new User(req.body);
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await user.save();
            res.send(user);
        })
    } catch (error) {
        res.status(500).send({error: "invalid request body"});
    }
})

module.exports = router