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

module.exports.UserValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  phoneNumber:  Joi.string().length(10).pattern(/^0[0-9]{9}$/).required(),
  password: Joi.string().required(),
  role: Joi.string().valid('RESTAURANT_MANAGER', 'CLIENT').required()
});

module.exports.LoginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required() 
})

