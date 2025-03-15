'use client';

import { CanadianLocations } from '@/data/locations';
import { MapPin } from 'lucide-react';

type DriveTestCentreSelectProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export default function DriveTestCentreSelect({ 
  value, 
  onChange, 
  className = '' 
}: DriveTestCentreSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Drive Test Centre</label>
      <div className="relative">
        {/* Left icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none">
          <MapPin size={20} />
        </div>
        
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full pl-10 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 rounded-lg appearance-none transition-colors ${className}`}
        >
          <option value="" disabled>Select test centre</option>
          {CanadianLocations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name} (${location.basePrice})
            </option>
          ))}
        </select>
        
        {/* Right arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}