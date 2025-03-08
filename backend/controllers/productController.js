import Product from "../models/product/productModel.js";
import Variant from "../models/product/sizeVariantModel.js";

// @desc    Add a new product
// @route   POST /api/products/add
// @access  Admin
export const addProduct = async (req, res) => {
  const { name, category, description, brand } = req.body;

  if (!name || !category || !description || !brand) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newProduct = new Product({ name, category, description, brand });

  const savedProduct = await newProduct.save();
  res.status(201).json(savedProduct);
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  const products = await Product.find().populate("variants");
  res.status(200).json(products);
};





export const addVariant = async (req, res) => {
    const { productId, size, color, stock, price, mainImage, subImages } = req.body;
  
    if (!productId || !size || !color || !stock || !price || !mainImage || !subImages) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
  
    const newVariant = new Variant({
      product: productId,
      size,
      color,
      stock,
      price,
      mainImage,
      subImages,
    });
  
    const savedVariant = await newVariant.save();
  
    // Add variant to product's variant list
    product.variants.push(savedVariant._id);
    await product.save();
  
    res.status(201).json(savedVariant);
  };