import Product from "../models/product/productModel.js";
import Variant from "../models/product/sizeVariantModel.js";
import Category from "../models/product/categoryModel.js";

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

// @desc    Add a new category
// @route   POST /api/products/category/add
// @access  Admin
export const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  // Check if category already exists
  const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = new Category({
    name,
    status: "listed"
  });

  const savedCategory = await newCategory.save();
  res.status(201).json(savedCategory);
};

// @desc    Get all categories
// @route   GET /api/products/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.status(200).json(categories);
};

// @desc    Update category status
// @route   PUT /api/products/category/:id/status
// @access  Admin
export const updateCategoryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !['listed', 'Not listed'].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.status = status;
  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
};

// @desc    Update category name
// @route   PUT /api/products/category/:id
// @access  Admin
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  // Check if the new name already exists for other categories
  const existingCategory = await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    _id: { $ne: id } // Exclude current category from check
  });

  if (existingCategory) {
    return res.status(400).json({ message: "Category name already exists" });
  }

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  category.name = name;
  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
};