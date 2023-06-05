const express = require('express');
const router = express.Router();


const Uploader = require("../utils/multer")
const {RestaurantValidationSchema, MenuValidationSchema} = require("../utils/Validation");
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/Menu');
router.post('/', Uploader.array('images', 4),async(req,res) => {
    try{
        const data = JSON.parse(req.body.restaurantData)

        const {error, value} = RestaurantValidationSchema.validate(data)
    
        if(error) {
            return res.json({message: error.message, status: 404})
        }

        
        const fileLocations = req.files.map(file => file.path);
        
        let restaurantExists = await Restaurant.find({name: data.name})
        if(restaurantExists.length > 0) {
            return res.json({message: "Restaurant already exists", status: 404})
        }

        let restaurant = new Restaurant({...data, images: fileLocations})
        let response = await restaurant.save()

        return res.json({message: "Successfully created Restaurant", data: response, status: 201})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})

router.get('/:restaurantId', (req,res) => {
    try{
        let id = req.params.id
    
        let restaurant = Restaurant.findById(id)
    
        if(restaurant)
            return res.json({data: restaurant, status: 200})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})
router.post('/:restaurantId', Uploader.single("image") ,async(req,res) => {
    try{
        const id = req.params.restaurantId 
        
        let restaurant = await Restaurant.findById(id)

        if(!restaurant){
            return res.json({message: "Restaurant not found", status: 404})
        }

        const data = JSON.parse(req.body.menuData)
        const filePath = req.file.path;

    
        const {error, value} = MenuValidationSchema.validate(data)
        if(error) {
            return res.json({message: error.message, status: 404})
        }

        let menuExists = await MenuItem.find({restaurant: id, name: data.name})
        if(menuExists.length > 0) {
            return res.json({message: "Menu already exists", status: 404})
        }

        let menuItem = new MenuItem({...data, image: filePath, restaurant: id})
        let response = await menuItem.save()

        let restaurantMenus = restaurant.menus
        restaurantMenus.push(response.id)
        restaurant.menus = restaurantMenus
        

        return res.json({message: "Successfully created Menu", data: response, status: 201})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})
module.exports = router
