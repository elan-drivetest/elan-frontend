'use client';

import { canadianAddresses } from '@/data/addresses';
import { useState, useEffect, useRef } from 'react';
import { MapPin, Mail } from 'lucide-react';

type AddressFieldProps = {
  address: string;
  postalCode: string;
  onAddressChange: (value: string) => void;
  onPostalCodeChange: (value: string) => void;
  placeholder?: string;
  isRequired?: boolean;
};

export default function AddressField({
  address,
  postalCode,
  onAddressChange,
  onPostalCodeChange,
  placeholder = "Enter address",
  isRequired = true,
}: AddressFieldProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Format postal code as user types (e.g., A1A 1A1)
  const formatPostalCode = (code: string) => {
    // Remove non-alphanumeric characters
    code = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Add space after 3rd character if needed
    if (code.length > 3) {
      code = code.slice(0, 3) + ' ' + code.slice(3);
    }
    
    return code.slice(0, 7); // Limit to 7 chars (including space)
  };

  // Handle postal code change
  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCode = formatPostalCode(e.target.value);
    onPostalCodeChange(formattedCode);
  };

  // Auto-complete address based on postal code
  useEffect(() => {
    if (postalCode.length >= 6) {
      // Simulate API call to get address from postal code
      const matchingAddresses = canadianAddresses.filter(
        addr => addr.postalCode.replace(/\s/g, '').startsWith(postalCode.replace(/\s/g, ''))
      );
      
      if (matchingAddresses.length > 0) {
        setSuggestions(matchingAddresses.map(addr => addr.fullAddress));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  }, [postalCode]);

  // Handle selection from suggestions
  const handleSelectSuggestion = (suggestion: string) => {
    onAddressChange(suggestion);
    setShowSuggestions(false);
  };

  // Handle click outside of suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative w-full sm:w-1/3">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
            <Mail className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full p-3 pl-10 border border-gray-300 rounded-lg transition-colors ${
              isFocused ? 'border-brand-500 ring-1 ring-brand-500' : 'focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
            }`}
            placeholder="Postal Code"
            required={isRequired}
          />
        </div>
        
        <div className="relative w-full sm:w-2/3">
          <div className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400">
            <MapPin className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            onFocus={() => {
              if (postalCode.length >= 6 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
              setIsFocused(true);
            }}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
            className={`w-full p-3 pl-10 border border-gray-300 rounded-lg transition-colors ${
              isFocused ? 'border-brand-500 ring-1 ring-brand-500' : 'focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
            }`}
            placeholder={placeholder}
            required={isRequired}
          />
          
          {showSuggestions && suggestions.length > 0 && (
            <div 
              ref={suggestionRef}
              className="absolute z-20 w-full mt-1 bg-white shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none border border-gray-200"
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="cursor-pointer select-none relative py-3 px-4 hover:bg-brand-50 transition-colors"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-brand-500 mr-2 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 px-1">
        {isRequired 
          ? "Enter postal code first for address suggestions"
          : "Optional. If not provided, pickup address will be used"}
      </p>
    </div>
  );
}