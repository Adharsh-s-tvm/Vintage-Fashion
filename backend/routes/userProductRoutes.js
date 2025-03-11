import express from "express";
import asyncHandler from "../middlewares/asyncHandler.js";
import { getAllShopBrands, getAllShopCategories, getAllShopProducts } from "../controllers/userProductController.js";


const router = express.Router();



router.get("/", asyncHandler(getAllShopProducts));

router.get('/categories', asyncHandler(getAllShopCategories))

router.get("/brands",asyncHandler(getAllShopBrands))



export default router