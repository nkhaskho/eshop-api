
const { User, validate } = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../services/email-service");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Retrieve all users.'
    let query = {}
    if (req.query.role) query.role = req.query.role;
    if (req.query.search) query.fullName = { $regex: req.query.search, $options: "i" }
    if (req.query.governorate) query.governorate = req.query.governorate;
	const users = await User.find(query);
	res.send(users);
})

function getUserErrorsDetails(errors) {
    errorsObj = {}
    errors.forEach(err => {
        errorsObj[err.path[0]] = err.message
    })
    return errorsObj;
}

// Add new user
router.post("/users", async (req, res) => {
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
            // Send welcome email
            sendEmail(user.email, "Welcome to E-Shop platform", `
            Hi ${user.fullName},\n
            Your account has been created with the unique _id: ${user._id},\n
            You could now access to E-Shop app using your following credentials:
                * username: ${user.username}
                * password: ${req.body.password}\n
            Regards,
            The E-Shop team
            `);
            res.send(user);
        })
    } catch (error) {
        res.status(500).send({error: "invalid request body"});
    }
})

// Get user by id
router.get("/users/:id", async (req, res) => {
	// #swagger.tags = ['users']
    // #swagger.description = 'Get user by id.'
    await User.findById(req.params.id).exec()
    .then(user => res.status(200).send(user))
    .catch(err => res.status(404).send({error: "user not found"}))
})

// Update existing user
router.put("/users/:id", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Update user by id.'
    if (req.body.password) delete req.body.password;
    User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) {
            res.status(404).send({error: "user not found"});
        } else {
            //user.password = "";
            res.send(user);
        }
    });
})

// Delete existing user
router.delete("/users/:id", async (req, res) => {
    // #swagger.tags = ['users']
    // #swagger.description = 'Delete user by id.'
    User.findByIdAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            res.status(404).send({error: "user not found"})
        } else {
            res.status(202).send("User deleted.")
        }
    });
})

module.exports = router