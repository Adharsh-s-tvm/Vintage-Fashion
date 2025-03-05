import React, { useState } from 'react';
import { Bell, Search, Globe, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/util';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { MobileSidebarTrigger } from './Sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../ui/DropDownMenu';

export function Navbar({ onMobileMenuClick }) {
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-20 w-full bg-white border-b border-gray-100 shadow-subtle">
            <div className={cn(
                "px-4 h-16 flex items-center justify-between transition-all",
                searchOpen ? "md:justify-center" : ""
            )}>
                {/* Left side */}
                <div className={cn(
                    "flex items-center",
                    searchOpen ? "hidden md:flex" : "flex"
                )}>
                    <MobileSidebarTrigger onClick={onMobileMenuClick} />
                    <span className="hidden ml-4 text-lg font-medium md:block">
                        Hi, Welcome back 👋
                    </span>
                </div>

                {/* Search - Desktop */}
                <div className={cn(
                    "hidden md:block",
                    searchOpen ? "w-full max-w-xl" : "w-80",
                )}>
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-10 h-10 bg-gray-50 focus:bg-white transition-all"
                            onFocus={() => setSearchOpen(true)}
                            onBlur={() => setSearchOpen(false)}
                        />
                        {searchOpen && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={() => setSearchOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div> */}
                </div>

                {/* Right side */}
                <div className={cn(
                    "flex items-center space-x-3",
                    searchOpen ? "hidden md:flex" : "flex"
                )}>
                    {/* Search button - Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <Search className="h-5 w-5" />
                    </Button>

                    {/* Language Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hidden md:flex">
                                <Globe className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>English (US)</DropdownMenuItem>
                            <DropdownMenuItem>French</DropdownMenuItem>
                            <DropdownMenuItem>German</DropdownMenuItem>
                            <DropdownMenuItem>Spanish</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 p-0">
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h5 className="font-medium">Notifications</h5>
                                    <span className="badge-info">3 New</span>
                                </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="h-9 w-9 rounded-full bg-blue-light flex items-center justify-center">
                                                <Bell className="h-4 w-4 text-blue" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">New user registered</p>
                                                <p className="text-xs text-gray-500">10 minutes ago</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-gray-100 text-center">
                                <Button variant="link" className="text-xs text-gray-500">View all notifications</Button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-light overflow-hidden">
                                    <img
                                        src="https://i.pravatar.cc/100?img=8"
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium">Sarah Johnson</div>
                                </div>
                                <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="p-2 border-b border-gray-100">
                                <div className="font-medium">Sarah Johnson</div>
                                <div className="text-xs text-gray-500">sarah@example.com</div>
                            </div>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Search Input (Overlay) */}
                {searchOpen && (
                    <div className="absolute inset-0 bg-white p-4 z-10 flex md:hidden animate-fade-in">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="pl-10 h-10 w-full bg-gray-50 focus:bg-white transition-all"
                                autoFocus
                            />
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2"
                            onClick={() => setSearchOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
} 