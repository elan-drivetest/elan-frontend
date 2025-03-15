'use client';

import { useState, useEffect, useRef } from 'react';
import { DriveTestCenter, Addon } from '@/types/search';
import AddonsSelectorV2 from './AddonsSelectorV2';
import { DollarSign, ChevronDown, ChevronUp, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type PricingCalculationV2Props = {
  testType: string;
  center: DriveTestCenter;
  meetAtCentre: boolean;
  distance: number;
  onAddonsChange: (addons: Addon[]) => void;
  selectedAddons?: Addon[];
  isLoading?: boolean;
};

export default function PricingCalculationV2({ 
  testType, 
  center, 
  meetAtCentre, 
  distance,
  onAddonsChange,
  selectedAddons: externalAddons = [],
  isLoading = false,
}: PricingCalculationV2Props) {
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>(externalAddons);
  const [expandAddons, setExpandAddons] = useState(false);
  const [expandDetails, setExpandDetails] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [freeAddonAdded, setFreeAddonAdded] = useState(false);
  const [hasProcessedFreeLesson, setHasProcessedFreeLesson] = useState(false);
  const originalFreeLessonRef = useRef<Addon | null>(null);
  
  // Animation states
  const [animationComplete, setAnimationComplete] = useState(false);

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
  const lessonPrice = testType === 'G2' ? 50 : 60;
  const mockTestPrice = 100;
  
  // Calculate the upgrade price based on free lesson type
  const calculateUpgradePrice = () => {
    if (perks.freeLesson30min) {
      return testType === 'G2' ? 50 : 50; // For 30-min free lesson, consistently $50
    } else if (perks.freeLesson1hour) {
      return testType === 'G2' ? 40 : 40; // For 1-hr free lesson, consistently $40
    }
    return mockTestPrice;
  };
  
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
          originalPrice: lessonPrice / 2,
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

  // Animation timing
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Calculate upgrade price
  const upgradePrice = calculateUpgradePrice();

  if (isLoading) {
    return (
      <div className="p-5 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="w-40 h-8 bg-gray-200 animate-pulse rounded-md"></div>
          <div className="w-20 h-8 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        
        <div className="h-52 bg-gray-100 rounded-lg animate-pulse"></div>
        
        <div className="h-24 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 space-y-6 transition-all duration-500">
      {/* Summary Header */}
      <div className={cn(
        "flex justify-between items-center",
        animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          Your Pricing Summary
        </h2>
        <div className="text-2xl md:text-3xl font-bold text-gray-900">
          ${totalPrice.toFixed(2)}
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn(
        "space-y-5 transition-all duration-500 delay-100",
        animationComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}>
        {/* Price Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
          <div 
            className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
            onClick={() => setExpandDetails(!expandDetails)}
          >
            <h3 className="font-medium text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 text-gray-500 mr-2" />
              Price Breakdown
            </h3>
            {expandDetails ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
          
          {expandDetails && (
            <div className="p-4 space-y-3 text-sm bg-gray-50">
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-gray-600">Base Price</span>
                <span className="font-medium">${center.basePrice.toFixed(2)}</span>
              </div>
              
              {!meetAtCentre && (
                <>
                  <div className="flex justify-between p-3 bg-white rounded-lg">
                    <span className="text-gray-600">First 50 km @ $1/km</span>
                    <span>${distancePricing.first50km.toFixed(2)}</span>
                  </div>
                  
                  {distance > 50 && (
                    <div className="flex justify-between p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Additional {distance - 50} km @ $0.50/km</span>
                      <span>${distancePricing.remaining.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between p-3 bg-white rounded-lg">
                    <span className="text-gray-600">Total Distance Cost</span>
                    <span className="font-medium">${totalDistancePrice.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {selectedAddons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="font-medium mb-2 text-gray-700 pl-1">Add-ons</p>
                  {selectedAddons.map((addon, index) => (
                    <div key={`${addon.id}-${index}`} className="flex justify-between p-3 bg-white rounded-lg">
                      <span className={addon.price === 0 ? 'text-green-700' : 'text-gray-600'}>
                        {addon.name}
                        {addon.price === 0 && <span className="text-xs text-green-600 ml-1">(Free)</span>}
                      </span>
                      <span className={addon.price === 0 ? 'text-green-700 font-medium' : ''}>
                        ${addon.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between font-medium text-base pt-3 mt-3 border-t border-gray-200 p-3 bg-white rounded-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Distance & Perks Info (only if not meeting at center) */}
        {!meetAtCentre && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Distance & Perks</h3>
                <div className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                  <span className="font-medium">{distance} km</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Perks Explanation */}
              <div className="space-y-2.5">
                {perks.freeDropoff && (
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800">Free drop-off service</span>
                      <p className="text-xs text-gray-500">Since your distance is over 50km</p>
                    </div>
                  </div>
                )}
                
                {perks.freeLesson30min && (
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800">Free 30-minute driving lesson</span>
                      <p className="text-xs text-gray-500">Since your distance is over 50km</p>
                    </div>
                  </div>
                )}
                
                {perks.freeLesson1hour && (
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-800">Free 1-hour driving lesson</span>
                      <p className="text-xs text-gray-500">Since your distance is over 100km</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Special Upgrade Offer */}
              {(perks.freeLesson30min || perks.freeLesson1hour) && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Special upgrade offer</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Upgrade your {perks.freeLesson30min ? '30-minute' : '1-hour'} free lesson 
                        to a complete Mock Test for just <span className="font-semibold">${upgradePrice}</span>
                      </p>
                      <button 
                        className="mt-3 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
                        onClick={() => {
                          // Find free lesson in selected addons
                          const freeLesson = selectedAddons.find(addon => addon.id === 'free-lesson');
                          
                          if (freeLesson) {
                            // Save the original free lesson if not already saved
                            if (!originalFreeLessonRef.current) {
                              originalFreeLessonRef.current = { ...freeLesson };
                            }
                            
                            // Remove free lesson and any other lesson or mock test
                            const filteredAddons = selectedAddons.filter(addon => 
                              addon.id !== 'free-lesson' && 
                              addon.id !== 'lesson-1hr' && 
                              addon.id !== 'mock-test'
                            );
                            
                            // Add upgraded mock test with appropriate price
                            const mockTest: Addon = {
                              id: 'mock-test',
                              name: `${testType} Mock Test (Upgraded)`,
                              price: upgradePrice,
                              originalPrice: 100,
                              description: 'Upgraded from free lesson',
                            };
                            
                            // Update selected addons
                            setSelectedAddons([...filteredAddons, mockTest]);
                            onAddonsChange([...filteredAddons, mockTest]);
                          }
                        }}
                      >
                        Upgrade to Mock Test
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <Info className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                <p>
                  We only charge for one-way distance even though our instructor travels both ways to serve you better.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Add-ons Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div 
            className="p-4 border-b border-gray-100 flex justify-between items-center cursor-pointer"
            onClick={() => setExpandAddons(!expandAddons)}
          >
            <h3 className="font-medium text-gray-800">
              Available Add-ons
            </h3>
            {expandAddons ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </div>
          
          <div className={cn(
            "transition-all duration-300",
            expandAddons ? "opacity-100 max-h-[2000px]" : "opacity-0 max-h-0 overflow-hidden"
          )}>
            <div className="p-4">
              <AddonsSelectorV2 
                testType={testType}
                selectedAddons={selectedAddons}
                onChange={handleAddonsChange}
                hasFreeLesson={perks.freeLesson30min || perks.freeLesson1hour}
              />
            </div>
          </div>
        </div>
        
        {/* Promo Code & Continue */}
        <div className="space-y-5 text-sm md:text-base pb-16 md:pb-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4">
            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">Have a promo code?</label>
            <div className="flex">
              <input
                type="text"
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-grow p-3 border border-gray-200 bg-white rounded-l-lg focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-r-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
          
          <button
            type="button"
            className="w-full hidden md:block py-4 px-6 bg-black hover:bg-black/90 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow"
          >
            Continue to Payment
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Refund Policy</a> and <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </p>
        </div>
      </div>
      
      {/* Floating Summary (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 p-3 shadow-lg z-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Total Price</p>
          <p className="text-xl font-semibold text-gray-900">${totalPrice.toFixed(2)}</p>
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-black hover:bg-black/90 text-white font-medium rounded-lg transition-colors shadow-sm"
        >
          Continue
        </button>
      </div>
    </div>
  );
}