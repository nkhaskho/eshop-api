
const { Order, validate } = require("../models/order");
const express = require("express");


const router = express.Router();

// Get all orders
router.get("/orders", async (req, res) => {
    // #swagger.tags = ['orders']
    // #swagger.description = 'Retrieve all orders.'
    let query = {}
    if (req.query.search) query.name = { $regex: req.query.search, $options: "i" }
	const orders = await Order.find(query);
	res.send(orders);
})

function getOrderErrorsDetails(errors) {
    errorsObj = {}
    errors.forEach(err => {
        errorsObj[err.path[0]] = err.message
    })
    return errorsObj;
}

// Add new order
router.post("/orders", async (req, res) => {
    // #swagger.tags = ['orders']
    // #swagger.description = 'Add new order.'
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({error: error.details[0].message}); //[0].message
        let order = Order(req.body)
        await order.save();
        res.send(order);
    } catch (error) {
        console.log(error)
        res.status(500).send({error: "invalid request body"});
    }
})

// Get order by id
router.get("/orders/:id", async (req, res) => {
	// #swagger.tags = ['orders']
    // #swagger.description = 'Get order by id.'
    await Order.findById(req.params.id).exec()
    .then(order => res.status(200).send(order))
    .catch(err => res.status(404).send({error: "order not found"}))
})

// Update existing order
router.put("/orders/:id", async (req, res) => {
    // #swagger.tags = ['orders']
    // #swagger.description = 'Update order by id.'
    if (req.body.password) delete req.body.password;
    Order.findByIdAndUpdate(req.params.id, req.body, (err, order) => {
        if (err) {
            res.status(404).send({error: "order not found"});
        } else {
            res.send(order);
        }
    });
})

// Delete existing order
router.delete("/orders/:id", async (req, res) => {
    // #swagger.tags = ['orders']
    // #swagger.description = 'Delete order by id.'
    Order.findByIdAndDelete({ _id: req.params.id }, (err, order) => {
        if (err) {
            res.status(404).send({error: "order not found"})
        } else {
            res.status(202).send("order deleted.")
        }
    });
})

module.exports = router