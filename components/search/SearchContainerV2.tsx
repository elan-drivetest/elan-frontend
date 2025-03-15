'use client';

import { useState } from 'react';
import SearchFormV2 from './SearchFormV2';
import { SearchData } from '@/types/search';
import { motion } from 'framer-motion';

type SearchContainerV2Props = {
  className?: string;
};

export default function SearchContainerV2({ className = '' }: SearchContainerV2Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    // In a real app, you might make API calls here or store the data
    console.log('Search submitted:', data);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Decorative elements with smooth animations */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 0.2, 
          scale: 1,
          x: [0, 10, 0],
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse" 
        }}
        className="hidden md:block absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-brand-200 to-brand-300 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 z-0"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 0.2, 
          scale: 1,
          x: [0, -10, 0],
          y: [0, 10, 0],
        }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 0.5
        }}
        className="hidden md:block absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-brand-200 to-brand-300 rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2 z-0"
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <SearchFormV2 onSearch={handleSearch} />
      </motion.div>
    </div>
  );
}