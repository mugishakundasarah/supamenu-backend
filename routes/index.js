const router = require("express").Router()
const authRoutes = require("./auth.controller")
const restaurantRoutes = require("./restaurant.controller")

router.use("/auth", authRoutes)
router.use("/restaurant", restaurantRoutes)

module.exports = router

