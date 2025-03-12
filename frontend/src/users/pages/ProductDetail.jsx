import React, { useEffect, useState } from 'react';
import { Layout } from '../layout/Layout';
import { Button } from '../../ui/Button';
import {
  Heart,
  Share2,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from '../../hooks/useToast';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../ui/Tabs';
import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import { Separator } from '../../ui/Separator';
import axios from 'axios';
import { api } from '../../lib/api';

// Mock product data

// Mock related products
const relatedProducts = [];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${api}/products/${id}`);
        const productData = response.data.product;
        console.log("Single product: ", productData);

        setProduct(productData);
        // Set initial variant if available
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Update selected variant when size changes
  useEffect(() => {
    if (product && selectedSize) {
      const variant = product.variants.find(v => v.size === selectedSize);
      setSelectedVariant(variant);
    }
  }, [selectedSize, product]);

  const getProductImages = (product) => {
    if (!product || !product.variants || product.variants.length === 0) return [];

    // Get the first variant that has images
    const primaryVariant = product.variants[0];
    const images = [];

    // Add main image
    if (primaryVariant.mainImage) {
      images.push(primaryVariant.mainImage);
    }

    // Add up to 3 sub images
    if (primaryVariant.subImages && primaryVariant.subImages.length > 0) {
      images.push(...primaryVariant.subImages.slice(0, 3));
    }

    return images;
  };

  const getAllImages = (product) => {
    if (!product) return [];
    const allImages = product.variants.reduce((images, variant) => {
      if (variant.mainImage) images.push(variant.mainImage);
      if (variant.subImages) images.push(...variant.subImages);
      return images;
    }, []);
    return [...new Set(allImages)]; // Remove duplicates
  };

  const getAvailableSizes = (product) => {
    if (!product) return [];
    return [...new Set(product.variants.map(variant => variant.size))];
  };

  // Add this function to handle mouse movement
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div>Product not found</div>
        </div>
      </Layout>
    );
  }

  const productImages = getProductImages(product);
  const availableSizes = getAvailableSizes(product);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        variant: "destructive",
        title: "Please select a size",
        description: "You must select a size before adding to cart",
      });
      return;
    }

    // In a real app, this would add the product to cart
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}) added to cart`,
    });
  };

  const handleAddToWishlist = () => {
    // In a real app, this would add the product to wishlist
    toast({
      title: "Added to wishlist",
      description: `${product.name} added to wishlist`,
    });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
              {isHovering && (
                <div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{
                    background: `url(${productImages[selectedImage]}) no-repeat`,
                    backgroundPosition: `${mousePosition.x}% ${mousePosition.y}%`,
                    backgroundSize: '200%',
                    zIndex: 10
                  }}
                />
              )}
            </div>

            {/* Thumbnail images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-md overflow-hidden bg-gray-100 
                      ${i === selectedImage ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedImage(i)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="#" className="hover:text-primary">{product.category.name}</Link>
              <span>/</span>
              <span className="text-gray-700">{product.name}</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-2 flex items-center space-x-2">
              <span className="text-sm text-gray-500">Brand:</span>
              <span className="text-sm font-medium">{product.brand.name}</span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-center">
              <span className="text-2xl font-bold text-gray-900">
                ₹{((selectedVariant?.price || product.variants[0]?.price) / 100).toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size selector */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="mt-2 grid grid-cols-6 gap-2"
              >
                {getAvailableSizes(product).map((size) => (
                  <div key={size}>
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium 
                        ${selectedSize === size
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-200 text-gray-900 hover:bg-gray-50'}`}
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Add to cart section */}
            <div className="mt-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>

              <Button
                className="flex-1"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Additional product info */}
            <div className="mt-6 text-sm text-gray-500 space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gray-400" />
                <span>Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-gray-400" />
                <span>Free returns within 30 days</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-gray-400" />
                <span>2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}