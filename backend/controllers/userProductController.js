import Product from "../models/product/productModel.js";
import Variant from "../models/product/sizeVariantModel.js";
import Category from "../models/product/categoryModel.js";
import Brand from "../models/product/brandModel.js";



export const getAllShopProducts = async (req, res) => {

    const baseQuery = {}

    try {
        const products = await Product.find(baseQuery)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('variants');

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};


export const getAllShopCategories = async (req, res) => {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
};


export const getAllShopBrands = async (req, res) => {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
};
