const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb){
        const uniqueFileName = Date.now() + '-' + file.originalname;
        cb(null, uniqueFileName);
    }
})

const upload = multer({storage: storage})

module.exports = upload 