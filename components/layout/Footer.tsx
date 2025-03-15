'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-6">
              <Image
                src="/full_logo_w.svg"
                alt="Elan Logo"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-400 mb-6">Providing quality driving test services across Ontario since 2020.</p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  G2 Road Tests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Full G Road Tests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Driving Lessons
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Mock Tests
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-0.5 mr-2 text-brand-500" />
                <span>123 Drive Ave, Toronto, ON</span>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 mt-0.5 mr-2 text-brand-500" />
                <span>info@elan-drivetest.ca</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mt-0.5 mr-2 text-brand-500" />
                <span>(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm w-full">
          <Link href="https://www.oonkoo.com" className="flex items-center justify-center w-full transition-colors">
            < p>© {currentYear} Elan - Drivetest Car Solutions. All rights reserved.</p>
              {/* Powered by OonkoO
              <Image
                src="/oonkoo_logo.svg"
                alt="Elan Logo"
                width={35}
                height={35}
                className="h-auto mx-2 saturate-0"
              /> */}
          </Link>
        </div>
      </div>
    </footer>
  );
}