'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type Testimonial = {
  name: string;
  location: string;
  image: string;
  text: string;
  rating: number;
};

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: 'Sarah K.',
      location: 'G2 Test - Toronto',
      image: 'S',
      text: 'I was so nervous about my G2 test, but the instructor was amazing! The pre-test practice really helped me calm my nerves.',
      rating: 5
    },
    {
      name: 'Michael T.',
      location: 'Full G Test - Mississauga',
      image: 'M',
      text: 'The instructor was punctual and professional. He gave me valuable tips about the test route and common mistakes to avoid.',
      rating: 5
    },
    {
      name: 'Jessica R.',
      location: 'G2 Test - Ottawa',
      image: 'J',
      text: 'The free 30-minute lesson before my test made all the difference! I got to practice the exact test route and passed with confidence.',
      rating: 5
    },
    {
      name: 'David L.',
      location: 'Full G Test - Brampton',
      image: 'D',
      text: 'Excellent service and very professional. The instructor was knowledgeable and made me feel comfortable during the test.',
      rating: 4
    },
    {
      name: 'Emily W.',
      location: 'G2 Test - Hamilton',
      image: 'E',
      text: 'I failed my test twice before using Elan. Their mock test helped me identify my weaknesses and I passed on my next attempt!',
      rating: 5
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from students who have successfully passed their driving tests with Elan.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentTestimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 hover:bg-gradient-to-br hover:from-gray-50 hover:to-emerald-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold">
                  {testimonial.image}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {testimonial.text}
              </p>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5" 
                    fill={i < testimonial.rating ? "currentColor" : "none"} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-4">
            <button 
              onClick={handlePrevPage}
              className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentPage ? 'bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={handleNextPage}
              className="p-2 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}