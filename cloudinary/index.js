// require("dotenv");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const ccn = process.env.CLOUDINARY_CLOUD_NAME;
// const aak = process.env.CLOUDINARY_KEY;
// const sse = process.env.CLOUDINARY_SECRET;


cloudinary.config({

    // cn = process.env.CLOUDINARY_CLOUD_NAME,
    // ak = process.env.CLOUDINARY_KEY,
    // se = process.env.CLOUDINARY_SECRET,

    // cloud_name: ccn,
    // api_key: aak,
    // api_secret: sse



    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_KEY,
    // api_secret: process.env.CLOUDINARY_SECRET



    cloud_name: 'don33zz5f',
    api_key: '692142499654959',
    api_secret: 'DRVP9YQuCUXp2RhIB-KOsliDyBA'


});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'YelpCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,
    storage
}