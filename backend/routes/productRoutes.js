import express from "express";
import multer from 'multer';
import path from 'path';

import { addProduct, getAllProducts, addVariant, addCategory, getAllCategories, updateCategoryStatus, updateCategory, addBrand, getAllBrands, updateBrandStatus, updateBrand, getProductVariants, deleteVariant, updateProduct } from "../controllers/productController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Admin: Add Product
router.post("/add", asyncHandler(addProduct));

// Get All Products
router.get("/", asyncHandler(getAllProducts));

router.post("/variant/add",
    upload.fields([
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 }
    ]),
    asyncHandler(addVariant)
);

router.get("/product/:productId/variants",
    asyncHandler(getProductVariants)
);

router.delete("/variant/:variantId",
    asyncHandler(deleteVariant)
);

// Category Routes
router.post("/category/add", asyncHandler(addCategory));
router.get("/categories", asyncHandler(getAllCategories));
router.put("/category/:id/status", asyncHandler(updateCategoryStatus));
router.put("/category/:id", asyncHandler(updateCategory));

// Brand Routes
router.post("/brand/add", asyncHandler(addBrand));
router.get("/brands", asyncHandler(getAllBrands));
router.put("/brand/:id/status", asyncHandler(updateBrandStatus));
router.put("/brand/:id", asyncHandler(updateBrand));

router.put("/product/:id",
    asyncHandler(updateProduct)
);

export default router