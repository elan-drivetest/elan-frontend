// import SearchContainer from '@/components/search/SearchContainer';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Features from '@/components/landing-page/Features';
import Testimonials from '@/components/landing-page/Testimonials';
import CallToActionFooter from '@/components/landing-page/CallToActionFooter';
// import { CheckCircle, Clock, Award } from 'lucide-react';
import SearchContainerV2 from '@/components/search/SearchContainerV2';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation bar */}
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative bg-gradient-to-b from-brand-50 to-white py-12 md:py-20 overflow-hidden">
          <div className="absolute top-20 left-20 w-40 h-40 bg-pink-300 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-brand-300 rounded-full opacity-10 blur-3xl"></div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Book Your Road Test <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">Car & Instructor</span>
              </h1>
              {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                We provide reliable cars and experienced instructors for your G2 or Full G road test across Ontario.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center bg-white py-2 px-4 rounded-full shadow-sm">
                  <CheckCircle className="h-5 w-5 text-brand-500 mr-2" />
                  <span className="text-gray-700 font-medium">Reliable Service</span>
                </div>
                <div className="flex items-center bg-white py-2 px-4 rounded-full shadow-sm">
                  <Clock className="h-5 w-5 text-brand-500 mr-2" />
                  <span className="text-gray-700 font-medium">Flexible Scheduling</span>
                </div>
                <div className="flex items-center bg-white py-2 px-4 rounded-full shadow-sm">
                  <Award className="h-5 w-5 text-brand-500 mr-2" />
                  <span className="text-gray-700 font-medium">Experienced Instructors</span>
                </div>
              </div> */}
            </div>
          </div>
        </section>
        
        {/* Search section */}
        <section className="py-8 -mt-10 mb-16" id="search">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <SearchContainer /> */}
            <SearchContainerV2 />
          </div>
        </section>
        
        {/* Features section */}
        <Features />
        
        {/* Testimonials section */}
        <Testimonials />
        
        {/* Call to action */}
        <CallToActionFooter />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}