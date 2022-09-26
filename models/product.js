




const mongoose = require("mongoose")
const Joi = require("joi");

const productSchema = mongoose.Schema({

	name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    promo: {
        type: Number,
        required: false,
        default: null
    },

    image: {
        type: String,
        default: null
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

})


const Product = mongoose.model("Product", productSchema);

const validate = (product) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        promo: Joi.number(),
        image: Joi.string()
    });
    return schema.validate(product);
};

module.exports = { Product, validate };