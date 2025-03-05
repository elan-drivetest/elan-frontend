'use client';

import { useState, useEffect } from 'react';
import { DriveTestCenter, Addon } from '@/types/search';
import AddonsSelector from './AddonsSelector';
import { DollarSign, Gift, MapPin, Tag, ShoppingBag } from 'lucide-react';

type PricingCalculationProps = {
  testType: string;
  center: DriveTestCenter;
  meetAtCentre: boolean;
  distance: number;
  onAddonsChange: (addons: Addon[]) => void;
  selectedAddons?: Addon[];
  isLoading?: boolean;
};

export default function PricingCalculation({ 
  testType, 
  center, 
  meetAtCentre, 
  distance,
  onAddonsChange,
  selectedAddons: externalAddons = [],
  isLoading = false,
}: PricingCalculationProps) {
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>(externalAddons);
  const [expandAddons, setExpandAddons] = useState(false);
  const [expandDetails, setExpandDetails] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [freeAddonAdded, setFreeAddonAdded] = useState(false);
  const [hasProcessedFreeLesson, setHasProcessedFreeLesson] = useState(false);

  // Calculate perks based on distance
  const perks = {
    freeDropoff: distance >= 50,
    freeLesson30min: distance >= 50 && distance < 100,
    freeLesson1hour: distance >= 100,
  };

  // Calculate distance pricing
  const distancePricing = {
    first50km: Math.min(distance, 50) * 1,
    remaining: distance > 50 ? (distance - 50) * 0.5 : 0
  };

  const totalDistancePrice = distancePricing.first50km + distancePricing.remaining;
  
  // Get test type prices
  // const mockTestPrice = 100;
  const lessonPrice = testType === 'G2' ? 50 : 60;
  
  // Calculate total price
  let totalPrice = center.basePrice;
  
  if (!meetAtCentre) {
    totalPrice += totalDistancePrice;
  }
  
  // Add price of selected addons
  selectedAddons.forEach(addon => {
    totalPrice += addon.price;
  });

  // Reset and sync state when external props change
  useEffect(() => {
    // Only set selected addons if the external addons actually changed
    if (JSON.stringify(externalAddons) !== JSON.stringify(selectedAddons)) {
      setSelectedAddons(externalAddons);
    }
    
    // Reset the free lesson tracking if test type changes or meet at center changes
    if (externalAddons.length === 0) {
      setFreeAddonAdded(false);
      setHasProcessedFreeLesson(false);
    }
  }, [externalAddons, testType, meetAtCentre, selectedAddons]);

  // Add free lesson based on distance but only once
  useEffect(() => {
    if (!meetAtCentre && !freeAddonAdded && !hasProcessedFreeLesson) {
      let freeLesson: Addon | null = null;
      
      if (perks.freeLesson1hour) {
        freeLesson = {
          id: 'free-lesson',
          name: `Free 1-Hour ${testType} Driving Lesson`,
          price: 0,
          originalPrice: lessonPrice,
          description: 'Included as a free perk for 100km+ pickup distance'
        };
      } else if (perks.freeLesson30min) {
        freeLesson = {
          id: 'free-lesson',
          name: `Free 30-Minute ${testType} Driving Lesson`,
          price: 0,
          originalPrice: lessonPrice,
          description: 'Included as a free perk for 50km+ pickup distance'
        };
      }
      
      if (freeLesson && !selectedAddons.some(addon => addon.id === 'free-lesson')) {
        // Remove any existing lesson addons before adding the free one
        const filteredAddons = selectedAddons.filter(addon => addon.id !== 'lesson-1hr');
        const updatedAddons = [...filteredAddons, freeLesson];
        setSelectedAddons(updatedAddons);
        onAddonsChange(updatedAddons);
        setFreeAddonAdded(true);
        setHasProcessedFreeLesson(true);
      }
    }
  }, [meetAtCentre, perks.freeLesson30min, perks.freeLesson1hour, testType, lessonPrice, freeAddonAdded, selectedAddons, onAddonsChange, hasProcessedFreeLesson]);

  // Handle addon changes from child component
  const handleAddonsChange = (addons: Addon[]) => {
    setSelectedAddons(addons);
    onAddonsChange(addons);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="w-40 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-48 animate-pulse"></div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-48 animate-pulse"></div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-48 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <DollarSign className="h-7 w-7 text-emerald-500 mr-2" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Pricing Summary
          </h2>
        </div>
        <div className="text-3xl font-bold text-emerald-600">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
      
      {!meetAtCentre && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Perks Column */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Gift className="h-6 w-6 text-pink-500 mr-2" />
              <h3 className="text-xl font-bold text-pink-600">Your Perks</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${perks.freeDropoff ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <svg className={`h-4 w-4 ${perks.freeDropoff ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`ml-3 ${perks.freeDropoff ? 'font-medium' : 'text-gray-500'}`}>
                  Free drop-off (50km+)
                </span>
              </li>
              <li className="flex items-start">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${perks.freeLesson30min ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <svg className={`h-4 w-4 ${perks.freeLesson30min ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`ml-3 ${perks.freeLesson30min ? 'font-medium' : 'text-gray-500'}`}>
                  Free 30-min driving lesson (50km+)
                </span>
              </li>
              <li className="flex items-start">
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${perks.freeLesson1hour ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <svg className={`h-4 w-4 ${perks.freeLesson1hour ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className={`ml-3 ${perks.freeLesson1hour ? 'font-medium' : 'text-gray-500'}`}>
                  Free 1-hour driving lesson (100km+)
                </span>
              </li>
            </ul>
          </div>
          
          {/* Price Breakdown Column */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Tag className="h-6 w-6 text-pink-500 mr-2" />
                <h3 className="text-xl font-bold text-pink-600">Price Breakdown</h3>
              </div>
              <button 
                onClick={() => setExpandDetails(!expandDetails)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium"
              >
                {expandDetails ? 'Hide' : 'Show'} details
              </button>
            </div>
            
            {expandDetails && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span>Base Price:</span>
                  <span className="font-medium">${center.basePrice.toFixed(2)}</span>
                </div>
                
                {!meetAtCentre && (
                  <>
                    <div className="flex justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <span>First 50 km @ $1/km:</span>
                      <span>${distancePricing.first50km.toFixed(2)}</span>
                    </div>
                    
                    {distance > 50 && (
                      <div className="flex justify-between p-2 hover:bg-gray-50 rounded-lg">
                        <span>Additional {distance - 50} km @ $0.50/km:</span>
                        <span>${distancePricing.remaining.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-medium p-2 bg-gray-100 rounded-lg">
                      <span>Distance Cost:</span>
                      <span>${totalDistancePrice.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {selectedAddons.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="font-medium mb-2">Add-ons:</p>
                    {selectedAddons.map((addon, index) => (
                      <div key={`${addon.id}-${index}`} className="flex justify-between text-sm p-2 hover:bg-gray-50 rounded-lg">
                        <span className={addon.price === 0 ? 'text-green-600 font-medium' : ''}>{addon.name}</span>
                        <span className={addon.price === 0 ? 'text-green-600 font-medium' : ''}>${addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg pt-4 mt-4 border-t border-gray-200">
                  <span>Total:</span>
                  <span className="text-emerald-600">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Distance Details Column */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-pink-500 mr-2" />
              <h3 className="text-xl font-bold text-pink-600">Distance Details</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Estimated Distance:</span>
                <span className="font-bold text-lg">{distance} km</span>
              </div>
              
              {distance > 50 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 text-sm text-green-800">
                  <p className="font-bold text-center mb-2 text-base">DISCOUNT APPLIED!</p>
                  <p>Since your pickup location is <span className="font-semibold">{distance}km</span> away:</p>
                  <ul className="mt-2 space-y-2">
                    {perks.freeDropoff && (
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Drop-off is <span className="font-semibold">FREE</span>
                      </li>
                    )}
                    {perks.freeLesson30min && (
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        You get a <span className="font-semibold">free 30-min lesson</span>
                      </li>
                    )}
                    {perks.freeLesson1hour && (
                      <li className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        You get a <span className="font-semibold">free 1-hour lesson</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add-ons Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-emerald-500 mr-2" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Available Add-ons
            </h3>
          </div>
          <button 
            onClick={() => setExpandAddons(!expandAddons)}
            className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium transition-colors"
          >
            {expandAddons ? 'Hide options' : 'Show options'}
          </button>
        </div>
        
        {expandAddons && (
          <AddonsSelector 
            testType={testType}
            selectedAddons={selectedAddons}
            onChange={handleAddonsChange}
            hasFreeLesson={perks.freeLesson30min || perks.freeLesson1hour}
          />
        )}
      </div>
      
      {/* Coupon and Continue */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl border border-pink-100">
          <label htmlFor="coupon" className="block text-sm font-medium text-pink-700 mb-2">Have a promo code?</label>
          <div className="flex">
            <input
              type="text"
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-grow p-3 border border-pink-200 bg-white rounded-l-lg focus:ring-pink-500 focus:border-pink-500 focus:outline-none"
            />
            <button
              type="button"
              className="px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-r-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
        
        <button
          type="button"
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          Continue to Payment
        </button>
        
        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our <a href="#" className="text-emerald-600 hover:underline">Refund Policy</a> and <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
        </p>
      </div>
    </div>
  );
}