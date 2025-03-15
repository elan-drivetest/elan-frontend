'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [testimonialsPerView, setTestimonialsPerView] = useState(3); // Default to desktop view
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Update testimonials per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setTestimonialsPerView(1);
      } else if (window.innerWidth < 1024) {
        setTestimonialsPerView(2);
      } else {
        setTestimonialsPerView(3);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const maxIndex = Math.ceil(testimonials.length / testimonialsPerView) - 1;

  // Handle swipe functionality
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentIndex < maxIndex) {
      handleNext();
    } else if (isRightSwipe && currentIndex > 0) {
      handlePrev();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Navigation handlers
  const handleNext = () => {
    if (isAnimating) return;
    
    if (currentIndex < maxIndex) {
      setIsAnimating(true);
      setCurrentIndex(prevIndex => prevIndex + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    
    if (currentIndex > 0) {
      setIsAnimating(true);
      setCurrentIndex(prevIndex => prevIndex - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-brand-50 text-brand-500 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">What Our Customers Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from students who have successfully passed their driving tests with Elan.
          </p>
        </div>
        
        <div className="relative">
          {/* Testimonials slider */}
          <div 
            ref={sliderRef}
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.ceil(testimonials.length / testimonialsPerView)}, 100%)`,
              }}
            >
              {Array.from({ length: Math.ceil(testimonials.length / testimonialsPerView) }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-4">
                    {testimonials.slice(
                      pageIndex * testimonialsPerView, 
                      (pageIndex + 1) * testimonialsPerView
                    ).map((testimonial, index) => (
                      <div 
                        key={`${pageIndex}-${index}`}
                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex items-center mb-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800 font-bold">
                            {testimonial.image}
                          </div>
                          <div className="ml-3">
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-500 text-sm">{testimonial.location}</p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                          {testimonial.text}
                        </p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4 h-4" 
                              fill={i < testimonial.rating ? "currentColor" : "none"} 
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="hidden md:flex justify-between items-center absolute top-1/2 left-0 right-0 -mt-6 px-4">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0 || isAnimating}
              className={cn(
                "w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity",
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              )}
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button 
              onClick={handleNext}
              disabled={currentIndex === maxIndex || isAnimating}
              className={cn(
                "w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center transition-opacity",
                currentIndex === maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
              )}
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          
          {/* Mobile indicators */}
          <div className="mt-8 flex items-center justify-center md:hidden">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0 || isAnimating}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                currentIndex === 0 ? "opacity-30" : ""
              )}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-2 mx-4">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!isAnimating) {
                      setIsAnimating(true);
                      setCurrentIndex(i);
                      setTimeout(() => setIsAnimating(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={handleNext}
              disabled={currentIndex === maxIndex || isAnimating}
              className={cn(
                "w-8 h-8 flex items-center justify-center",
                currentIndex === maxIndex ? "opacity-30" : ""
              )}
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          {/* Desktop page indicators */}
          <div className="hidden md:flex justify-center mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(i);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-2.5 h-2.5 mx-1 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}