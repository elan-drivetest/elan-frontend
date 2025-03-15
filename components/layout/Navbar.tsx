'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, User, ChevronDown, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      href: '/',
      children: null
    },
    { 
      id: 'services', 
      label: 'Services', 
      href: '#',
      children: [
        { label: 'G2 Road Tests', href: '#' },
        { label: 'Full G Road Tests', href: '#' },
        { label: 'Driving Lessons', href: '#' },
        { label: 'Mock Tests', href: '#' }
      ]
    },
    { 
      id: 'locations', 
      label: 'Locations', 
      href: '#',
      children: [
        { label: 'Toronto', href: '#' },
        { label: 'Mississauga', href: '#' },
        { label: 'Brampton', href: '#' },
        { label: 'Ottawa', href: '#' },
        { label: 'See All Locations', href: '#', highlight: true }
      ]
    },
    { 
      id: 'faq', 
      label: 'FAQ', 
      href: '#',
      children: null
    },
    { 
      id: 'contact', 
      label: 'Contact Us', 
      href: '#',
      children: null
    }
  ];

  const toggleDropdown = (id: string | null) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        }`}
      >
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
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <div key={item.id} className="relative">
                  {item.children ? (
                    <div 
                      className="relative group"
                      onMouseEnter={() => toggleDropdown(item.id)}
                      onMouseLeave={() => toggleDropdown(null)}
                    >
                      <button 
                        className={`px-3 py-2 rounded-md text-gray-800 hover:text-brand-600 font-medium flex items-center transition-colors ${
                          activeDropdown === item.id ? 'text-brand-600' : ''
                        }`}
                        onClick={() => toggleDropdown(item.id)}
                      >
                        {item.label}
                        <ChevronDown 
                          size={16} 
                          className={`ml-1 transition-transform ${
                            activeDropdown === item.id ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Dropdown menu */}
                      <AnimatePresence>
                        {activeDropdown === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-10"
                          >
                            <div className="py-1">
                              {item.children.map((child, idx) => (
                                <Link
                                  key={idx}
                                  href={child.href}
                                  className={`block px-4 py-2 text-sm ${
                                    child.highlight 
                                      ? 'bg-brand-50 text-brand-700 font-medium hover:bg-brand-100' 
                                      : 'text-gray-700 hover:bg-gray-50 hover:text-brand-600'
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="px-3 py-2 rounded-md text-gray-800 hover:text-brand-600 font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Action Buttons (Desktop) */}
            <div className="hidden md:flex items-center space-x-3">
              <a href="tel:+11234567890" className="flex items-center text-gray-700 hover:text-brand-600 transition-colors">
                <Phone size={18} className="mr-1" />
                <span className="text-sm font-medium">Support</span>
              </a>
              <div className="h-6 w-px bg-gray-300 mx-1"></div>
              <Link 
                href="#search" 
                className="px-4 py-2 bg-brand-100 text-brand-800 hover:bg-brand-200 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Calendar size={16} className="mr-1" />
                <span>Book Now</span>
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 bg-gray-900 text-white hover:bg-black rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <User size={16} className="mr-1" />
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
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {navItems.map(item => (
                  <div key={item.id} className="border-b border-gray-100 pb-2 last:border-0">
                    {item.children ? (
                      <>
                        <button 
                          onClick={() => toggleDropdown(item.id)}
                          className="flex justify-between items-center w-full px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform ${
                              activeDropdown === item.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-4 mt-1 border-l-2 border-brand-200 pl-4 space-y-1"
                            >
                              {item.children.map((child, idx) => (
                                <Link
                                  key={idx}
                                  href={child.href}
                                  className={`block px-3 py-2 text-sm rounded-md ${
                                    child.highlight 
                                      ? 'text-brand-700 font-medium bg-brand-50' 
                                      : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Action Buttons */}
                <div className="pt-4 flex flex-col gap-2">
                  <Link
                    href="#search"
                    className="w-full px-4 py-3 bg-brand-500 text-white rounded-lg font-medium text-center flex justify-center items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar size={18} className="mr-2" />
                    Book Your Road Test
                  </Link>
                  <Link
                    href="/login"
                    className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium text-center flex justify-center items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} className="mr-2" />
                    Sign in to Account
                  </Link>
                  <a 
                    href="tel:+11234567890"
                    className="w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-center flex justify-center items-center mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone size={18} className="mr-2" />
                    Call Support
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}