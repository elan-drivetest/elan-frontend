'use client';

import { Phone, CalendarCheck } from 'lucide-react';

export default function CallToActionFooter() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="text-center md:text-left mb-10 md:mb-0 md:max-w-xl">
            <span className="inline-block px-3 py-1 bg-emerald-900/30 text-brand-300 rounded-full text-sm font-medium mb-4">
              Need Assistance?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to book your road test?</h2>
            <p className="text-gray-300 text-lg">
              Our team is ready to assist you with any questions about booking, test preparation, or special requirements.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="tel:+11234567890" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Phone className="h-5 w-5" />
              <span>Support Call</span>
            </a>
            <a 
              href="#search" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <CalendarCheck className="h-5 w-5" />
              <span>Book Now</span>
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand-400 mb-2">5,000+</div>
            <p className="text-gray-300">Successful Tests</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand-400 mb-2">98%</div>
            <p className="text-gray-300">Pass Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="text-3xl font-bold text-brand-400 mb-2">92</div>
            <p className="text-gray-300">Test Centers</p>
          </div>
        </div>
      </div>
    </section>
  );
}