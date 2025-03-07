import React, { useState, useEffect } from 'react';
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
import { logoutAdmin } from '../../redux/api/adminApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { clearAdminInfo, setAdminInfo } from '../../redux/slices/adminSlice';

export function Navbar({ onMobileMenuClick }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const adminData = useSelector(state => state.admin.data);
    const isAuthenticated = useSelector(state => state.admin.isAuthenticated);

    // Check authentication status and redirect if needed
    useEffect(() => {
        if (!isAuthenticated && location.pathname !== '/admin/signin') {
            navigate('/admin/signin');
        }
    }, [isAuthenticated, navigate, location.pathname]);

    useEffect(() => {
        const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
        const jwt = localStorage.getItem('jwt');

        if (adminInfo && jwt) {
            dispatch(setAdminInfo(adminInfo));
        }

    }, [dispatch]);


    const handleLogout = () => {
        logoutAdmin()
            .then(() => {
                dispatch(clearAdminInfo());
                localStorage.removeItem('adminInfo');
                localStorage.removeItem('jwt');
                navigate('/admin/signin');
            })
            .catch(error => {
                console.error('Logout failed:', error);
                dispatch(clearAdminInfo());
                localStorage.removeItem('adminInfo');
                localStorage.removeItem('jwt');
                navigate('/admin/signin');
            });
    };

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
                        Welcome {adminData?.firstname || 'Admin'} 👋
                    </span>
                </div>

                {/* Search - Desktop */}
                <div className={cn(
                    "hidden md:block",
                    searchOpen ? "w-full max-w-xl" : "w-80",
                )}>
                    {/* Search input removed for brevity */}
                </div>

                {/* Right side */}
                <div className={cn(
                    "flex items-center space-x-3",
                    searchOpen ? "hidden md:flex" : "flex"
                )}>
                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-blue-light overflow-hidden">
                                    <img
                                        src="https://i.pravatar.cc/100?img=8"
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium">{adminData?.firstname || ''} {adminData?.lastname || ''}</p>
                                    <p className="text-xs text-gray-500">{adminData?.email || ''}</p>
                                </div>
                                <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-white text-black">
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={handleLogout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Search Input (Overlay) */}
                {searchOpen && (
                    <div className="absolute inset-0 bg-white p-4 z-10 flex md:hidden animate-fade-in">
                        {/* Mobile search input removed for brevity */}
                    </div>
                )}
            </div>
        </header>
    );
}