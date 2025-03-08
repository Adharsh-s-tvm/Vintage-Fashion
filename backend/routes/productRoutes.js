import express from "express";

import { addProduct, getAllProducts, addVariant, addCategory, getAllCategories, updateCategoryStatus, updateCategory } from "../controllers/productController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// Admin: Add Product
router.post("/add", asyncHandler(addProduct));

// Get All Products
router.get("/", asyncHandler(getAllProducts));

router.post("/add", asyncHandler(addVariant));

// Category Routes
router.post("/category/add", asyncHandler(addCategory));
router.get("/categories", asyncHandler(getAllCategories));
router.put("/category/:id/status", asyncHandler(updateCategoryStatus));
router.put("/category/:id", asyncHandler(updateCategory));

export default router