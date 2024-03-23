const Joi = require('joi');

let listingSchema = Joi.object({
    lisitng: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(0).required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required(),
})

let reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        Comment: Joi.string().required(),
    }).required()
})
module.exports = { listingSchema, reviewSchema };