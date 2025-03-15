'use client';

import { useState } from 'react';
import SearchForm from './SearchForm';
import { SearchData } from '@/types/search';

type SearchContainerProps = {
  className?: string;
};

export default function SearchContainer({ className = '' }: SearchContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchData, setSearchData] = useState<SearchData | null>(null);

  const handleSearch = (data: SearchData) => {
    setSearchData(data);
    // In a real app, you might make API calls here or store the data
    console.log('Search submitted:', data);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {/* Decorative elements - modified to stay within container bounds */}
      <div className="hidden md:block absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-brand-200 to-brand-300 rounded-full opacity-20 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="hidden md:block absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tr from-brand-200 to-brand-300 rounded-full opacity-20 blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative z-10">
        <SearchForm onSearch={handleSearch} />
      </div>
    </div>
  );
}