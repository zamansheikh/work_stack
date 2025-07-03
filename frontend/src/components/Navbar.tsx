'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, User, LogIn, LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and brand */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#8BC342] to-[#6fa332] rounded-lg flex items-center justify-center">
                                <Image src="/logo/logo.png" alt="Logo" width={20} height={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900">BowlersNetwork</span>
                                <span className="text-xs text-gray-500">Feature Tracker</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                        >
                            Features
                        </Link>
                        <Link
                            href="/features/roadmap"
                            className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                        >
                            Roadmap
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                        >
                            About
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/admin"
                                    className="text-gray-700 hover:text-[#8BC342] transition-colors flex items-center space-x-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Admin</span>
                                </Link>
                                <Link
                                    href="/admin/features/new"
                                    className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white px-4 py-2 rounded-lg hover:from-[#6fa332] hover:to-[#5c8a28] transition-all duration-200 flex items-center space-x-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Feature</span>
                                </Link>
                                <div className="flex items-center space-x-2 text-gray-700">
                                    <User className="w-5 h-5" />
                                    <span className="text-sm">{user?.name || user?.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white px-4 py-2 rounded-lg hover:from-[#6fa332] hover:to-[#5c8a28] transition-all duration-200 flex items-center space-x-2"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Admin Login</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-700 hover:text-[#8BC342] transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link
                                href="/"
                                className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </Link>
                            <Link
                                href="/features/roadmap"
                                className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Roadmap
                            </Link>
                            <Link
                                href="/about"
                                className="text-gray-700 hover:text-[#8BC342] transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-200">
                                    <Link
                                        href="/admin"
                                        className="text-gray-700 hover:text-[#8BC342] transition-colors flex items-center space-x-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/admin/features/new"
                                        className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white px-4 py-2 rounded-lg hover:from-[#6fa332] hover:to-[#5c8a28] transition-all duration-200 flex items-center space-x-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Feature</span>
                                    </Link>
                                    <div className="flex items-center space-x-2 text-gray-700 text-sm">
                                        <User className="w-4 h-4" />
                                        <span>{user?.name || user?.email}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="bg-gradient-to-r from-[#8BC342] to-[#6fa332] text-white px-4 py-2 rounded-lg hover:from-[#6fa332] hover:to-[#5c8a28] transition-all duration-200 flex items-center space-x-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Admin Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
