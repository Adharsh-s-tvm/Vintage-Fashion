import React, { useEffect, useState } from 'react';
import { Layout } from '../layout/Layout';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/util';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useSearchParams, useNavigate } from 'react-router';
import { api } from '../../lib/api';
import axios from 'axios';
import { Categories } from '../layout/Categories';
import { Slider } from "../../ui/slider";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/pagination';


// Add this constant at the top of your file, outside the component
const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

// Mock product data with the new structure
const products = [];



const ProductListing = () => {


  const [activeImage, setActiveImage] = useState({});
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([]);

  //search querries
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || 10000
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(
    searchParams.getAll('size') || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');


  // Temporary states for filter values before applying
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [tempCategories, setTempCategories] = useState([]);
  const [tempBrands, setTempBrands] = useState([]);
  const [tempSizes, setTempSizes] = useState(selectedSizes);
  const [tempSort, setTempSort] = useState(sortBy);

  const [products, setProducts] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(4); // Number of products per page

  const navigate = useNavigate();

  const fetchProducts = async (params) => {
    try {
      const queryParams = new URLSearchParams(params);
      queryParams.set('page', currentPage);
      queryParams.set('limit', itemsPerPage);

      const response = await axios.get(`${api}/products?${queryParams}`);
      console.log("Products fetched ", response.data);

      // Update products and pagination info
      setProducts(response.data.products || []);

      // Update totalPages from the pagination object
      if (response.data.pagination) {
        console.log("Pagination data:", response.data.pagination);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.log(error);
      setTotalPages(1); // Set default value in case of error
    }
  }


  const handlePageChange = (newPage) => {
    // Update the URL with the new page
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);

    setCurrentPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  useEffect(() => {
    const params = searchParams.toString();
    fetchProducts(params)
  }, [searchParams, currentPage])

  //aplying querry to url
  const handleApplyFilters = () => {
    setSelectedCategories(tempCategories);
    setSelectedBrands(tempBrands);
    setPriceRange(tempPriceRange);
    setSortBy(tempSort);
    setSelectedSizes(tempSizes);

    const params = new URLSearchParams();

    // Add categories to params
    tempCategories.forEach(categoryId => params.append('category', categoryId));

    // Add brands to params
    tempBrands.forEach(brandId => params.append('brand', brandId));

    // Add price range to params
    params.set('minPrice', tempPriceRange[0]);
    params.set('maxPrice', tempPriceRange[1]);

    // Add sort parameter
    if (tempSort !== 'newest') {
      params.set('sort', tempSort);
    }

    // Add sizes to params
    tempSizes.forEach(size => params.append('size', size));

    setSearchParams(params);

    fetchProducts(params)
  }

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setTempCategories([]);
    setTempBrands([]);
    setPriceRange([0, 10000]);
    setTempPriceRange([0, 10000]);
    setSortBy('newest');
    setTempSort('newest');
    setSelectedSizes([]);
    setTempSizes([]);
    setSearchParams({});
  }

  const handleCategoryChange = (category) => {
    setTempCategories(prev => {
      const isSelected = prev.includes(category._id);
      if (isSelected) {
        return prev.filter(id => id !== category._id);
      } else {
        return [...prev, category._id];
      }
    });
  }
  const handleBrandChange = (brand) => {
    setTempBrands(prev => {
      const isSelected = prev.includes(brand._id);
      if (isSelected) {
        return prev.filter(id => id !== brand._id);
      } else {
        return [...prev, brand._id];
      }
    });
  }

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/products/categories`);
      console.log("Category fetched :", response.data)
      const categoriesData = response.data.categories || response.data;
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${api}/admin/products/brands`);
      console.log('Brands response:', response.data);
      const brandsData = response.data.brands || response.data;
      setBrands(brandsData);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  // Extract unique categories, brands, and sizes for filters

  const sizes = [...new Set(products.flatMap(product => product.variants.map(variant => variant.size)))];

  // Function to get lowest price variant for each product
  const getLowestPrice = (product) => {
    return Math.min(...product.variants.map(variant => variant.price));
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    // Price filter
    const productLowestPrice = getLowestPrice(product);
    if (productLowestPrice < priceRange[0] || productLowestPrice > priceRange[1]) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category._id)) {
      return false;
    }

    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand._id)) {
      return false;
    }

    // Size filter
    if (selectedSizes.length > 0) {
      const productSizes = product.variants.map(variant => variant.size);
      if (!selectedSizes.some(size => productSizes.includes(size))) {
        return false;
      }
    }

    return true;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return getLowestPrice(a) - getLowestPrice(b);
      case 'price-high':
        return getLowestPrice(b) - getLowestPrice(a);
      case 'a-z':
        return a.name.localeCompare(b.name);
      case 'z-a':
        return b.name.localeCompare(a.name);
      default: // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Handle size toggle
  const handleSizeChange = (size) => {
    setTempSizes(prev => {
      const isSelected = prev.includes(size);
      if (isSelected) {
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  // Initialize active images
  React.useEffect(() => {
    const initialActiveImages = {};
    products.forEach(product => {
      if (product.variants.length > 0) {
        initialActiveImages[product._id] = product.variants[0].mainImage;
      }
    });
    setActiveImage(initialActiveImages);
  }, []);

  // Handle image change for a product
  const handleImageChange = (productId, imageUrl) => {
    setActiveImage(prev => ({
      ...prev,
      [productId]: imageUrl
    }));
  };

  // Format price in rupees
  const formatPrice = (price) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  // Get all images for a product (main + sub images from first variant with subImages)
  const getAllImages = (product) => {
    const variantWithSubImages = product.variants.find(v => v.subImages.length > 0);
    if (variantWithSubImages) {
      return [variantWithSubImages.mainImage, ...variantWithSubImages.subImages];
    }
    return product.variants.length > 0 ? [product.variants[0].mainImage] : [];
  };

  // Custom sidebar content for product listing
  const sidebarContent = (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center">
              <Checkbox
                id={`category-${category._id}`}
                checked={tempCategories.includes(category._id)}
                onCheckedChange={() => handleCategoryChange(category)}
              />
              <label
                htmlFor={`category-${category._id}`}
                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={10000}
            step={100}
            value={tempPriceRange}
            onValueChange={setTempPriceRange}
            className="mt-2"
          />
          <div className="flex items-center justify-between">
            <div className="text-sm">₹{tempPriceRange[0]}</div>
            <div className="text-sm">₹{tempPriceRange[1]}</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Sort By</h3>
        <Select
          value={tempSort}
          onValueChange={(value) => setTempSort(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="a-z">Name: A to Z</SelectItem>
            <SelectItem value="z-a">Name: Z to A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Brands</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand._id} className="flex items-center">
              <Checkbox
                id={`brand-${brand._id}`}
                checked={tempBrands.includes(brand._id)}
                onCheckedChange={() => handleBrandChange(brand)}
              />
              <label
                htmlFor={`brand-${brand._id}`}
                className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
              >
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_SIZES.map((size) => (
            <Button
              key={size}
              variant={tempSizes.includes(size) ? "default" : "outline"}
              className="h-10 w-full"
              onClick={() => handleSizeChange(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full bg-gray-300"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </Button>

        <Button
          className="w-full mt-4"
          onClick={handleClearFilters}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);

    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Layout showSidebar={true} sidebarContent={sidebarContent}>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Jackets</h1>
          <p className="text-gray-600">
            {sortedProducts.length} products found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const images = getAllImages(product);
            const lowestPrice = getLowestPrice(product);
            const availableSizes = [...new Set(product.variants.map(v => v.size))];

            return (
              <Card
                key={product._id}
                className="overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => handleProductClick(product._id)}
              >
                <div className="relative pb-[125%] overflow-hidden">
                  <img
                    src={activeImage[product._id] || (product.variants[0]?.mainImage || '')}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Thumbnail images */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-2 overflow-x-auto">
                    {images.slice(0, 4).map((img, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-16 w-16 flex-shrink-0 cursor-pointer border-2 rounded",
                          activeImage[product._id] === img ? "border-primary" : "border-transparent"
                        )}
                        onClick={() => handleImageChange(product._id, img)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${index}`}
                          className="h-full w-full object-cover rounded"
                        />
                      </div>
                    ))}
                    {images.length > 4 && (
                      <div className="h-16 w-16 flex-shrink-0 flex items-center justify-center bg-gray-100 text-gray-600 rounded">
                        +{images.length - 4}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">{product.brand.name}</span>
                    <span className="mx-2">•</span>
                    <span className="text-xs font-medium text-gray-500">{product.category.name}</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {availableSizes.map(size => (
                      <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-lg">{formatPrice(lowestPrice)}</span>
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
            );
          })}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters to find products.</p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>



              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

      </div>


    </Layout>
  );
};

export default ProductListing;
