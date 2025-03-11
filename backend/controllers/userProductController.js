import Product from "../models/product/productModel.js";
import Variant from "../models/product/sizeVariantModel.js";
import Category from "../models/product/categoryModel.js";
import Brand from "../models/product/brandModel.js";



export const getAllShopProducts = async (req, res) => {

    try {

        const {
            category,
            brand,
            minPrice,
            maxPrice,
            size,
            sort,
            page = 1,
            limit = 8
        } = req.query;


        const baseQuery = {}

        // Category filter
        if (category) {
            const categoryIds = Array.isArray(category) ? category : [category];
            baseQuery.category = { $in: categoryIds };
        }

        // Brand filter
        if (brand) {
            const brandIds = Array.isArray(brand) ? brand : [brand];
            baseQuery.brand = { $in: brandIds };
        }
        // Size and Price filter using $lookup and $match
        const aggregationPipeline = [
            {
                $lookup: {
                    from: 'variants',
                    localField: 'variants',
                    foreignField: '_id',
                    as: 'variants'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $unwind: '$brand'
            }
        ];


        // Add size filter if provided
        if (size) {
            const sizes = Array.isArray(size) ? size : [size];
            aggregationPipeline.push({
                $match: {
                    'variants.size': { $in: sizes }
                }
            });
        }

        // Add price range filter if provided
        if (minPrice !== undefined || maxPrice !== undefined) {
            aggregationPipeline.push({
                $match: {
                    'variants.price': {
                        ...(minPrice && { $gte: Number(minPrice) }),
                        ...(maxPrice && { $lte: Number(maxPrice) })
                    }
                }
            });
        }

        // Add base query conditions
        if (Object.keys(baseQuery).length > 0) {
            aggregationPipeline.unshift({ $match: baseQuery });
        }

        // Add sorting
        if (sort) {
            let sortStage = {};
            switch (sort) {
                case 'price-low':
                    sortStage = { 'variants.price': 1 };
                    break;
                case 'price-high':
                    sortStage = { 'variants.price': -1 };
                    break;
                case 'newest':
                    sortStage = { createdAt: -1 };
                    break;
                case 'a-z':
                    sortStage = { name: 1 };
                    break;
                case 'z-a':
                    sortStage = { name: -1 };
                    break;
                default:
                    sortStage = { createdAt: -1 };
            }
            aggregationPipeline.push({ $sort: sortStage });
        }


        // Add pagination
        const skip = (Number(page) - 1) * Number(limit);
        aggregationPipeline.push(
            { $skip: skip },
            { $limit: Number(limit) }
        );

        // Execute the aggregation pipeline
        const products = await Product.aggregate(aggregationPipeline);

        // Get total count for pagination
        const totalProducts = await Product.aggregate([
            ...aggregationPipeline.slice(0, -2), // Remove skip and limit stages
            { $count: 'total' }
        ]);

        const total = totalProducts[0]?.total || 0;
        const totalPages = Math.ceil(total / Number(limit));

        res.json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalProducts: total,
                hasNextPage: Number(page) < totalPages,
                hasPrevPage: Number(page) > 1
            }
        });

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
