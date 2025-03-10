import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';


// Add error handling for cloudinary configuration
console.log("Initializing Cloudinary storage...")




const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'jackets',
        allowed_formats: ['jpg', 'png', 'jpeg', 'avif', 'webp'],
    },
});


//lllllll
cloudinary.config().cloud_name ?
    console.log("Cloudinary configured successfully") :
    console.log("Cloudinary configuration missing");


const upload = multer({ storage });

// export default upload;

const uploadFields = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'subImages', maxCount: 5 }
]);

const handleUpload = (req, res, next) => {
    console.log("Starting file upload...");


    // Add timeout to prevent hanging
    const uploadTimeout = setTimeout(() => {
        console.error("Upload timeout after 30 seconds");
        return res.status(500).json({
            message: "Upload timeout - check Cloudinary configuration"
        });
    }, 30000);




    uploadFields(req, res, (err) => {
        console.log("working")
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({
                message: "File upload error",
                error: err.message
            });
        }
        console.log("Upload successful");
        next();
    });
};

export { handleUpload };