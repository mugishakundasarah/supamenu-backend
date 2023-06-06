const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: "dfc7c3dhn",
  api_key: "139468582761811",
  api_secret: "kDuL0J8_rxhPGcXPBdsxNasUmLk"
});

module.exports = cloudinary