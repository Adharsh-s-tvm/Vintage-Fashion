import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  UserCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/DropdownMenu';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: 'All', href: '#' },
    { name: 'Winter', href: '#' },
    { name: 'Leather', href: '#' },
    { name: 'Denim', href: '#' },
    { name: 'Summer', href: '#' },
  ];

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      {/* Top navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/ecommerce" className="text-xl font-bold text-gray-900">
              JACKET<span className="text-primary">HUB</span>
            </Link>
          </div>

          {/* Navigation links - desktop */}
          <nav className="hidden md:flex space-x-8">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-gray-700 hover:text-primary font-medium px-3 py-2 text-sm"
              >
                {category.name}
              </a>
            ))}
          </nav>

          {/* Search, cart, account - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 text-gray-500 hover:text-primary"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            <Link to="/ecommerce/wishlist" className="p-2 text-gray-500 hover:text-primary relative group">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>

            <Link to="/ecommerce/cart" className="p-2 text-gray-500 hover:text-primary relative group">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>

              {/* Mini cart preview on hover */}
              <div className="absolute right-0 top-10 w-72 bg-white shadow-lg rounded-lg p-4 hidden group-hover:block">
                <div className="text-sm font-medium text-gray-900 mb-2">3 items in cart</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <div className="w-10 h-10 bg-gray-100 rounded">
                      <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1036&q=80"
                        alt="Product" className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium">Winter Jacket</p>
                      <p className="text-xs text-gray-500">1 × $129.99</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">$389.97</span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => navigate('/ecommerce/cart')}
                    >
                      View Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => navigate('/ecommerce/checkout')}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/ecommerce/dashboard')}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/ecommerce/orders')}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/ecommerce/wishlist')}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>My Wishlist</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/signin')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              className="p-2 text-gray-500 hover:text-primary"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            <Link to="/ecommerce/wishlist" className="p-2 text-gray-500 hover:text-primary relative">
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </Link>

            <Link to="/ecommerce/cart" className="p-2 text-gray-500 hover:text-primary relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-primary"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar - appears when search is clicked */}
      {searchOpen && (
        <div className="border-t border-gray-100 py-3 px-4 bg-white">
          <div className="max-w-3xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for jackets..."
              className="pl-10 pr-10 py-2 w-full"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="block px-3 py-2 text-gray-700 hover:text-primary text-base font-medium"
              >
                {category.name}
              </a>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2">
              <Link
                to="/ecommerce/dashboard"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary text-base font-medium"
              >
                <UserCircle className="mr-2 h-5 w-5" />
                My Account
              </Link>
              <Link
                to="/ecommerce/orders"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary text-base font-medium"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                My Orders
              </Link>
              <Link
                to="/signin"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-primary text-base font-medium"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
