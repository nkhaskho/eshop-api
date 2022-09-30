




const mongoose = require("mongoose")
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);

const productOrderSchema = mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    quantity: {
        type: Number,
        default: 1
    }

})

const orderSchema = mongoose.Schema({

	client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    total: {
        type: Number,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    status: {
        type: String,
        enum: ['on-going', 'delivered', 'canceled'],
        default: 'on-going'  
    },

    products: [productOrderSchema]

})


const Order = mongoose.model("Order", orderSchema);

const validate = (order) => {
    const schema = Joi.object({
        client: Joi.objectId().required(),
        total: Joi.number().required(),
        status: Joi.string().required(),
        products: Joi.array().required()
    });
    return schema.validate(order);
};


module.exports = { Order, validate };