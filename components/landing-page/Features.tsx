'use client';

import { Shield, Clock, DollarSign } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      title: 'Reliable Service',
      description: "Our experienced instructors ensure you're well-prepared for your test day with last-minute tips and guidance."
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: 'Convenient Pickup',
      description: 'We offer flexible pickup and dropoff services throughout Ontario with special perks for longer distances.'
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
      title: 'Free Perks',
      description: 'Enjoy free driving lessons and dropoffs for longer distances, saving you time and money.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
            Our Benefits
          </span>
          <h2 className="text-3xl font-bold mb-4">Why Choose Elan</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {"We've helped thousands of students across Ontario successfully complete their road tests with confidence."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#search" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors font-medium">
            See All Features
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}