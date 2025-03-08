import express from "express";

import { addProduct, getAllProducts,addVariant  } from "../controllers/productController.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const router = express.Router();

// Admin: Add Product
router.post("/add", asyncHandler(addProduct));

// Get All Products
router.get("/", asyncHandler(getAllProducts));

router.post("/add", asyncHandler(addVariant));

export default router