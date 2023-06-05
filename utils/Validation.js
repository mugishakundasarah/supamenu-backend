const Joi = require("joi")

module.exports.RestaurantValidationSchema = Joi.object({
    name: Joi.string().required(),
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    ownerName: Joi.string().required(),
    ownerPhoneNumber: Joi.string().required(),
    ownerEmail: Joi.string().email().required(),
    category: Joi.string().required().valid("restaurant" , "pub", "hotel", "coffeeshop", "other").required(),
    description: Joi.string().required(),
    openingHours: Joi.string().required(),
    closingHours: Joi.string().required()
});


module.exports.MenuValidationSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().valid('Drink', 'Starter', 'Appetizer', 'Dessert', 'Main').required()
  });
