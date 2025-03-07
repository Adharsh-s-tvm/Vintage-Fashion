import React, { useState } from 'react';
import { Layout } from '../layout/Layout';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ShoppingCart, Heart, Star } from 'lucide-react';

// Mock product data
const products = [
    {
        id: 1,
        name: "Winter Expedition Jacket",
        price: 259.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80",
        category: "Winter",
        brand: "North Face",
        popular: true,
        isNew: true,
        featured: true,
    },
    {
        id: 2,
        name: "Waterproof Rain Jacket",
        price: 129.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1545594861-3bef43ff2fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
        category: "Rain",
        brand: "Columbia",
        popular: true,
        isNew: false,
        featured: true,
    },
    {
        id: 3,
        name: "Lightweight Windbreaker",
        price: 89.99,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1039&q=80",
        category: "Sport",
        brand: "Adidas",
        popular: false,
        isNew: true,
        featured: false,
    },
    {
        id: 4,
        name: "Premium Leather Jacket",
        price: 349.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
        category: "Leather",
        brand: "Patagonia",
        popular: true,
        isNew: false,
        featured: true,
    },
    {
        id: 5,
        name: "Denim Trucker Jacket",
        price: 119.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1037&q=80",
        category: "Denim",
        brand: "Nike",
        popular: false,
        isNew: true,
        featured: false,
    },
    {
        id: 6,
        name: "Insulated Ski Jacket",
        price: 299.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542327897-4141b355e20e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        category: "Winter",
        brand: "North Face",
        popular: true,
        isNew: false,
        featured: true,
    },
    {
        id: 7,
        name: "Vintage Denim Jacket",
        price: 149.99,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80",
        category: "Denim",
        brand: "Columbia",
        popular: false,
        isNew: true,
        featured: false,
    },
    {
        id: 8,
        name: "Lightweight Running Jacket",
        price: 79.99,
        rating: 4.1,
        image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
        category: "Sport",
        brand: "Adidas",
        popular: true,
        isNew: true,
        featured: false,
    }
];

const ProductListing = () => {
    const [priceRange, setPriceRange] = useState([0, 400]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [sortBy, setSortBy] = useState('newest');

    // Extract unique categories and brands for filters
    const categories = [...new Set(products.map(product => product.category))];
    const brands = [...new Set(products.map(product => product.brand))];

    // Filter products based on selected filters
    const filteredProducts = products.filter(product => {
        // Price filter
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
            return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Brand filter
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }

        return true;
    });

    // Sort products based on selected sort option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'a-z':
                return a.name.localeCompare(b.name);
            case 'z-a':
                return b.name.localeCompare(a.name);
            case 'popular':
                return a.popular === b.popular ? 0 : a.popular ? -1 : 1;
            case 'rating':
                return b.rating - a.rating;
            case 'featured':
                return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
            default: // newest
                return a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1;
        }
    });

    // Handle category toggle
    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    // Handle brand toggle
    const handleBrandChange = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand)
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    // Custom sidebar content for product listing
    const sidebarContent = (
        <>
            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`category-${category.toLowerCase()}`}
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="mr-2"
                            />
                            <label
                                htmlFor={`category-${category.toLowerCase()}`}
                                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                {category} Jackets
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Price Range</h3>
                <input
                    type="range"
                    min={0}
                    max={400}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                />
                <div className="flex justify-between text-sm mt-2">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Sort By</h3>
                <select
                    className="w-full p-2 border rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="a-z">Name: A to Z</option>
                    <option value="z-a">Name: Z to A</option>
                    <option value="popular">Popularity</option>
                    <option value="rating">Average Rating</option>
                    <option value="featured">Featured</option>
                </select>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Brands</h3>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <div key={brand} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`brand-${brand.toLowerCase().replace(' ', '-')}`}
                                checked={selectedBrands.includes(brand)}
                                onChange={() => handleBrandChange(brand)}
                                className="mr-2"
                            />
                            <label
                                htmlFor={`brand-${brand.toLowerCase().replace(' ', '-')}`}
                                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                className="w-full mt-4"
                onClick={() => {
                    setPriceRange([0, 400]);
                    setSelectedCategories([]);
                    setSelectedBrands([]);
                    setSortBy('newest');
                }}
            >
                Clear Filters
            </Button>
        </>
    );

    return (
        <Layout showSidebar={true} sidebarContent={sidebarContent}>
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">All Jackets</h1>
                <p className="text-gray-600">
                    {sortedProducts.length} products found
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative pb-[125%] overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {product.isNew && (
                                <span className="absolute top-2 right-2 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded">New</span>
                            )}
                        </div>

                        <div className="p-4">
                            <div className="flex items-center mb-1">
                                <span className="text-xs font-medium text-gray-500">{product.brand}</span>
                                <span className="mx-2">•</span>
                                <span className="text-xs font-medium text-gray-500">{product.category}</span>
                            </div>

                            <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>

                            <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                                <div className="flex space-x-2">
                                    <Button size="icon" variant="outline" className="h-8 w-8">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" className="h-8">
                                        <ShoppingCart className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your filters to find products.</p>
                </div>
            )}
        </Layout>
    );
};

export default ProductListing;
