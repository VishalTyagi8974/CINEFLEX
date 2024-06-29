const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const posterStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Posters',
        allowed_formats: ["jpg", "jpeg", "png"]
    }
});

const videoStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Videos',
        resource_type: 'video',
        allowed_formats: ['mp4', 'avi', 'mkv']
    }
});

module.exports = { posterStorage, videoStorage, cloudinary };
