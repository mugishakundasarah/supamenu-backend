const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path');

const Uploader = require("../utils/multer")
const cloudinary = require("../utils/cloudinary")

const {RestaurantValidationSchema, MenuValidationSchema} = require("../utils/Validation");
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/Menu');
const Table = require("../models/Table");
const { authenticate, verifyRestaurantManager, verifyClient } = require('../utils/AuthenticateToken');
router.post('/', authenticate ,async(req,res) => {
    try{
        const data = req.body
        const {error, value} = RestaurantValidationSchema.validate(data)
    
        if(error) {
            return res.json({message: error.details[0].message, status: 404})
        }

        let restaurantExists = await Restaurant.find({name: data.name})
        if(restaurantExists.length > 0) {
            return res.json({message: "Restaurant already exists", status: 404})
        }

        let restaurant = new Restaurant(value)
        let response = await restaurant.save()

        return res.json({message: "Successfully created Restaurant", data: response, status: 201})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})

router.get('/', authenticate, verifyClient, async(req, res) => {
    try{
        let restaurant = await Restaurant.find().populate("menus")

        return res.json({data: restaurant, status: 200})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})

router.post('/:restaurantId/uploadFiles' , Uploader.array('images', 4) ,async(req, res) => {
    try {
        let restaurantId = req.params.restaurantId
        const saveImages = req.files.map(file => cloudinary.uploader.upload(file.path));

        const uploadedImages = await Promise.all(saveImages)
        const imageUrls = uploadedImages.map(data => data.url)

        // delete the temporary files  
        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });


        let restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {images: imageUrls})   
        return res.json({message: "successfully save restaurant images", status: 200, data: restaurant})
    } catch (error) {
        return res.json({message: error})
    }
})

router.get('/:restaurantId', authenticate,async(req,res) => {
    try{
        let id = req.params.restaurantId
        if(!id) return res.json({message: 'Please input a valid restaurant', status: 400})
        let restaurant = await Restaurant.findById(id).populate("menus")
        if(!restaurant) return res.json({message: 'Restaurant not found', status: 404})

        return res.json({data: restaurant, status: 200})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})

router.post('/:restaurantId/menu', authenticate, verifyRestaurantManager  ,async(req,res) => {
    try{
        const restaurantId = req.params.restaurantId 
        
        let restaurant = await Restaurant.findById(restaurantId)

        if(!restaurant){
            return res.json({message: "Please input a valid restaurant", status: 404})
        }
        const {error, value} = MenuValidationSchema.validate(req.body)
        if(error) {
            return res.json({message: error.details[0].message, status: 404})
        }

        let menuExists = await MenuItem.find({restaurant: restaurantId, name: value.name})
        if(menuExists.length > 0) {
            return res.json({message: "Menu already exists", status: 404})
        }
        let menuItem = new MenuItem({...value , restaurant: restaurantId})
        let response = await menuItem.save()

        let restaurantMenus = restaurant.menus
        restaurantMenus.push(response.id)
        restaurant.menus = restaurantMenus
        
        // Save the menu in restaurant
        await Restaurant.findByIdAndUpdate(restaurantId, {menus: restaurantMenus})
        
        return res.json({message: "Successfully created Menu", data: response, status: 201})
    }catch(err){
        console.log(err)
        return res.json({message: err.message}).status(500)
    }
})


router.post('/:menuId/uploadFile' , Uploader.single("image") ,async(req, res) => {
    try {
        let menuId = req.params.menuId
        const saveImage = cloudinary.uploader.upload(req.file.path);

        const uploadedImage = await Promise.resolve(saveImage)

        const imageUrl = uploadedImage.url
        // delete the temporary file
        fs.unlinkSync(req.file.path)

        let menu = await MenuItem.findByIdAndUpdate(menuId, {image: imageUrl})   
        return res.json({message: "successfully saved menu image", data: menu,status: 200})
    } catch (error) {
        return res.json({message: error.message})
    }
})


// Create a new table
router.post('/tables', async (req, res) => {
    try {
      const { tableNumber, restaurantId } = req.body;
  
      const table = new Table({
        tableNumber,
        restaurantId
      });
  
      const newTable = await table.save();
      return res.status(201).json({data: newTable});
    } catch (error) {
      return res.status(500).json({ message: 'Failed to create a new table' });
    }
  });
  
  // Get all tables
  router.get('/tables', async (req, res) => {
    try {
      const tables = await Table.find();
      return res.json({data: tables});
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve tables' });
    }
  });
  
  // Get a specific table by ID
  router.get('/tables/:id', async (req, res) => {
    try {
      const table = await Table.findById(req.params.id);
      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }
      return res.json({data: table});
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve the table' });
    }
  });
  
  // Update a table
  router.put('/tables/:id', async (req, res) => {
    try {
      const { tableNumber, restaurantId } = req.body;
  
      const table = await Table.findByIdAndUpdate(
        req.params.id,
        { tableNumber, restaurantId },
        { new: true }
      );
  
      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }
  
      return res.json({data: table});
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update the table' });
    }
  });
  
  
module.exports = router
