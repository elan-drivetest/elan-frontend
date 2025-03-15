'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, DollarSign, ChevronRight, CheckCircle, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Feature = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  extraInfo: string;
  stats: {
    value: string;
    label: string;
  };
  benefits: string[];
};

const heroImage = [
  { src: '/landingPage/1.svg', alt: 'Hero image' },
  { src: '/landingPage/2.svg', alt: 'Hero image 2' },
  { src: '/landingPage/3.svg', alt: 'Hero image 3' }
]

export default function Features() {
  const [activeTab, setActiveTab] = useState<string>('reliable');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  
  const features: Feature[] = [
    {
      id: 'reliable',
      icon: <Shield className="w-8 h-8 text-brand-500" />,
      title: 'Reliable Service',
      description: "Our experienced instructors ensure you're well-prepared for your test day with last-minute tips and guidance.",
      extraInfo: "98% of our students pass their road test on the first attempt.",
      stats: {
        value: "98%",
        label: "Pass Rate"
      },
      benefits: [
        "Fully licensed and certified instructors",
        "Regular vehicle maintenance",
        "Timely service guaranteed"
      ]
    },
    {
      id: 'convenient',
      icon: <Clock className="w-8 h-8 text-brand-500" />,
      title: 'Convenient Pickup',
      description: 'We offer flexible pickup and dropoff services throughout Ontario with special perks for longer distances.',
      extraInfo: "We offer pickups from every cities across Canada.",
      stats: {
        value: "All 92",
        label: "Test Centers"
      },
      benefits: [
        "Door-to-door service available",
        "No extra fees for waiting time",
        "Flexible schedule options"
      ]
    },
    {
      id: 'free',
      icon: <DollarSign className="w-8 h-8 text-brand-500" />,
      title: 'Free Perks',
      description: 'Enjoy free driving lessons and dropoffs for longer distances, saving you time and money.',
      extraInfo: "Students with pickup locations over 100km away get a free 1-hour driving lesson.",
      stats: {
        value: "30min+",
        label: "Free Lessons"
      },
      benefits: [
        "Free 30min lesson for 50km+ distance",
        "Free 1-hour lesson for 100km+ distance",
        "Free drop-off for longer distances"
      ]
    }
  ];

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Render desktop view (enhanced cards layout)
  if (!isMobile) {
    return (
      <section className="py-20 relative overflow-hidden bg-gray-50">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-40 right-10 w-48 h-48 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-pink-200 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-brand-50 text-brand-500 rounded-full text-sm font-medium mb-4">
              Our Benefits
            </span>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">
              Why Choose Elan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {"We've helped thousands of students across Ontario successfully complete their road tests with confidence."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                onHoverStart={() => setIsHovered(feature.id)}
                onHoverEnd={() => setIsHovered(null)}
                whileHover={{ y: -8 }}
              >
                {/* Card header with gradient */}
                <div className="bg-gradient-to-r from-brand-500 to-brand-600 p-6 relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
                  <div className="absolute -right-4 -bottom-8 w-16 h-16 bg-white/10 rounded-full"></div>
                  
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{feature.title}</h3>
                  <div className="flex items-center">
                    <span className="text-brand-100 text-sm">
                      {feature.stats.value}
                    </span>
                    <div className="h-4 w-px bg-brand-100/30 mx-2"></div>
                    <span className="text-brand-100 text-sm">
                      {feature.stats.label}
                    </span>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-brand-500" />
                    Key Benefits
                  </h4>
                  
                  <ul className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mt-1 mr-2 text-brand-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <motion.div
                      className="flex items-center text-brand-600 font-medium text-sm"
                      animate={{ x: isHovered === feature.id ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span>Learn more</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <a 
              href="#search" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium shadow-md"
            >
              Find Your Perfect Package
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          
          {/* Additional trust indicators */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {heroImage.map((image, index) => (
                <div key={index} className="p-4 flex flex-col items-center">
                  <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Mobile view with tabs
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-brand-100 text-brand-800 rounded-full text-sm font-medium mb-4">
            Our Benefits
          </span>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-brand-600 to-brand-600 bg-clip-text text-transparent">
            Why Choose Elan
          </h2>
          <p className="text-base text-gray-600">
            {"We've helped thousands of students successfully complete their road tests with confidence."}
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="relative bg-white rounded-xl shadow-md p-1 mb-6">
          <div className="flex relative z-10">
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === feature.id 
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {feature.title.split(' ')[0]}
              </button>
            ))}
          </div>
          
          {/* Animated background for active tab */}
          <motion.div 
            className="absolute top-1 bottom-1 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg z-0"
            initial={false}
            animate={{
              left: `${(features.findIndex(f => f.id === activeTab) * 100) / features.length + 0.333}%`,
              width: `${(100 / features.length) - 0.667}%`
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
        
        {/* Tab Content with Animation */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {features.map((feature) => (
                <div 
                  key={feature.id}
                  className={activeTab === feature.id ? 'block' : 'hidden'}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-brand-50 rounded-lg flex items-center justify-center mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-brand-600 text-sm font-medium">
                          {feature.stats.value}
                        </span>
                        <div className="h-3 w-px bg-gray-300 mx-2"></div>
                        <span className="text-gray-500 text-sm">
                          {feature.stats.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-2 text-brand-500" />
                    Key Benefits
                  </h4>
                  
                  <ul className="space-y-2 mb-4">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 mt-0.5 mr-2 text-brand-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-brand-50 p-4 rounded-lg border border-brand-100 mt-4">
                    <h4 className="font-medium text-brand-800 mb-2">Did you know?</h4>
                    <p className="text-sm text-brand-700">
                      {feature.extraInfo}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe indicator for app-like feel */}
        <div className="flex justify-center gap-1.5 mb-6">
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              className="w-2 h-2 rounded-full bg-brand-200"
              animate={{
                backgroundColor: activeTab === feature.id ? "#10b981" : "#a7f3d0",
                scale: activeTab === feature.id ? 1.2 : 1
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        
        <div className="text-center">
          <a 
            href="#search" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-colors font-medium shadow-md"
          >
            Find Your Package
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}