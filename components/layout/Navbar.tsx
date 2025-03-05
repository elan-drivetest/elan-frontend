'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 bg-white shadow-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="relative h-8 w-24">
                  <Image
                    src="/full_logo.svg"
                    alt="Elan Logo"
                    fill
                    sizes="(max-width: 768px) 96px, 120px"
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="#" 
                className="font-medium text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Home
              </Link>
              <Link 
                href="#" 
                className="font-medium text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Services
              </Link>
              <Link 
                href="#" 
                className="font-medium text-gray-800 hover:text-emerald-600 transition-colors"
              >
                FAQ
              </Link>
              <Link 
                href="#" 
                className="font-medium text-gray-800 hover:text-emerald-600 transition-colors"
              >
                Contact Us
              </Link>
            </nav>

            {/* Sign In Button (Desktop) */}
            <div className="hidden md:block">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium"
              >
                <User size={16} />
                <span>Sign in</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-800 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="container mx-auto px-4 py-3 space-y-2">
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gray-900 text-white hover:bg-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}