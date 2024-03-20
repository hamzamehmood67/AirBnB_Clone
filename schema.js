const Joi = require('joi');

let listingSchema = Joi.object({
    lisitng: Joi.object({
        title: Joi.string().required(),
        description: Joi.string(),
        price: Joi.number().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
    }).required(),
})

module.exports = listingSchema;