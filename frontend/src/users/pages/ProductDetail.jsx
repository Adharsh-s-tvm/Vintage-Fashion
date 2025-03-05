import React, { useState } from 'react';
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

// Mock product data
const product = {
  id: 1,
  name: 'Winter Puffer Jacket',
  price: 129.99,
  discountPrice: 99.99,
  description: 'Stay warm and stylish with our premium Winter Puffer Jacket. Designed for extreme cold weather, this jacket features high-quality insulation, water-resistant outer shell, and adjustable hood for maximum protection against the elements.',
  details: [
    'Water-resistant outer shell',
    'Premium synthetic insulation',
    'Adjustable, insulated hood',
    'Multiple pockets for storage',
    'Elastic cuffs to keep out cold air',
    'Two-way zipper for versatile wear'
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  colors: ['Black', 'Navy', 'Green', 'Red'],
  rating: 4.8,
  reviewCount: 124,
  inStock: true,
  images: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80',
    'https://images.unsplash.com/photo-1580906853614-e46b744c97dd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1612459284472-89148d107d94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    'https://images.unsplash.com/photo-1600434481680-7c72717ec9ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  ],
  brand: 'North Face',
  sku: 'WPJ-12345',
  category: 'Winter Jackets'
};

// Mock related products
const relatedProducts = [
  {
    id: 2,
    name: 'Leather Biker Jacket',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: 3,
    name: 'Denim Jacket with Patches',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: 4,
    name: 'Waterproof Rain Jacket',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1620330389433-b9bb261344ba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  },
  {
    id: 5,
    name: 'Fleece-Lined Jacket',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1613473060226-dd81153a63db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
  }
];

export default function ProductDetail() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        variant: "destructive",
        title: "Please select a size",
        description: "You must select a size before adding to cart",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        variant: "destructive",
        title: "Please select a color",
        description: "You must select a color before adding to cart",
      });
      return;
    }

    // In a real app, this would add the product to cart
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize}, ${selectedColor}) added to cart`,
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
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  className={`aspect-square rounded-md overflow-hidden bg-gray-100 ${i === selectedImage ? 'ring-2 ring-primary' : ''
                    }`}
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
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <Link to="/ecommerce" className="hover:text-primary">Home</Link>
              <span>/</span>
              <Link to="#" className="hover:text-primary">{product.category}</Link>
              <span>/</span>
              <span className="text-gray-700">{product.name}</span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="mt-2 flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="mt-4 flex items-center">
              {product.discountPrice ? (
                <>
                  <span className="text-2xl font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                  <span className="ml-2 text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                  <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <Button variant="link" className="text-xs p-0 h-auto">Size Guide</Button>
              </div>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="mt-2 grid grid-cols-6 gap-2"
              >
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem
                      value={size}
                      id={`size-${size}`}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`size-${size}`}
                      className={`flex h-10 items-center justify-center rounded-md border text-sm font-medium ${selectedSize === size
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                        } cursor-pointer`}
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Color</h3>
              <RadioGroup
                value={selectedColor}
                onValueChange={setSelectedColor}
                className="mt-2 flex space-x-3"
              >
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem
                      value={color}
                      id={`color-${color}`}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`color-${color}`}
                      className={`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 ${selectedColor === color ? 'ring ring-primary' : ''
                        }`}
                    >
                      <span className="text-xs font-medium mt-1">{color}</span>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

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
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-sm text-gray-500 space-y-3">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gray-400" />
                <span>Free shipping on orders over $50</span>
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

        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">Product Details</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-600">
                  {product.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="specs">
              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b pb-2">
                      <span className="text-sm text-gray-500">Brand</span>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-sm text-gray-500">SKU</span>
                      <p className="font-medium">{product.sku}</p>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-sm text-gray-500">Material</span>
                      <p className="font-medium">Polyester, Nylon</p>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-sm text-gray-500">Care Instructions</span>
                      <p className="font-medium">Machine wash cold</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="py-6">
                <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    Based on {product.reviewCount} reviews
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">John D.</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Verified Purchase • 2 months ago</p>
                    <p className="text-sm text-gray-600">
                      This jacket exceeded my expectations. It's incredibly warm yet lightweight, and the water-resistant shell has kept me dry in light rain. Highly recommend!
                    </p>
                  </div>

                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-medium">Sarah M.</h4>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Verified Purchase • 1 month ago</p>
                    <p className="text-sm text-gray-600">
                      Great jacket for the price. The sizing runs a bit large, so I would recommend sizing down. Otherwise, it's perfect for cold weather.
                    </p>
                  </div>
                </div>

                <Button className="mt-6">Write a Review</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/ecommerce/product/${product.id}`}
                className="group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
