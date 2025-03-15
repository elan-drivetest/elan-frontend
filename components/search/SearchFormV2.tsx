'use client';

import { useState, useEffect, useRef } from 'react';
import { SearchFormProps, SearchData, DriveTestCenter, Addon } from '@/types/search';
import { CanadianLocations } from '@/data/locations';
import PricingCalculationV2 from './PricingCalculationV2';
import AddressField from './AddressField';
import MeetAtCentreToggle from './MeetAtCentreToggle';
import DriveTestCentreSelect from './DriveTestCentreSelect';
import RoadTestTypeSelect from './RoadTestTypeSelect';
import { Calendar, Car, Clock, MapPin, ChevronRight, Info, Check } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { motion, AnimatePresence } from 'framer-motion';

export default function SearchFormV2({
  onSearch,
  initialValues,
  className = '',
}: SearchFormProps) {
  const [formData, setFormData] = useState<SearchData>(
    initialValues || {
      roadTestType: '',
      testDate: '',
      testTime: '',
      driveTestCentreId: '',
      meetAtCentre: false,
      pickupAddress: '',
      pickupPostalCode: '',
      dropoffAddress: '',
      dropoffPostalCode: '',
      selectedAddons: [],
    }
  );

  const [selectedCenter, setSelectedCenter] = useState<DriveTestCenter | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [showPricing, setShowPricing] = useState<boolean>(false);
  const [shouldResetAddons, setShouldResetAddons] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<string>("0.00");
  
  const headerRef = useRef<HTMLDivElement>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  // Update selected center when driveTestCentreId changes
  useEffect(() => {
    if (formData.driveTestCentreId) {
      const center = CanadianLocations.find(loc => loc.id === formData.driveTestCentreId);
      setSelectedCenter(center || null);
    } else {
      setSelectedCenter(null);
    }
  }, [formData.driveTestCentreId]);

  // Reset addons when test type changes
  useEffect(() => {
    if (shouldResetAddons) {
      setFormData(prev => ({
        ...prev,
        selectedAddons: []
      }));
      setShouldResetAddons(false);
    }
  }, [shouldResetAddons]);

  // Sticky header handling
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight;
        const scrollY = window.scrollY;
        setIsSticky(scrollY > headerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate total price whenever relevant values change
  useEffect(() => {
    if (selectedCenter) {
      let total = selectedCenter.basePrice;
      
      // Add distance-based costs
      if (!formData.meetAtCentre) {
        const distancePricing = {
          first50km: Math.min(distance, 50) * 1,
          remaining: distance > 50 ? (distance - 50) * 0.5 : 0
        };
        total += distancePricing.first50km + distancePricing.remaining;
      }
      
      // Add price of selected addons
      formData.selectedAddons.forEach(addon => {
        total += addon.price;
      });
      
      setTotalPrice(total.toFixed(2));
    }
  }, [selectedCenter, formData.meetAtCentre, distance, formData.selectedAddons]);

  // Simulate distance calculation when pickup address changes
  useEffect(() => {
    if (formData.pickupPostalCode && selectedCenter) {
      // In a real app, this would be an API call to calculate distance
      // For demo purposes, we'll simulate a distance between 50-150km
      const simulatedDistance = Math.floor(Math.random() * 100) + 50;
      setDistance(simulatedDistance);
    } else {
      setDistance(0);
    }
  }, [formData.pickupPostalCode, selectedCenter]);

  // Validate form fields for the current step
  const validateCurrentStep = () => {
    const errors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!formData.roadTestType) {
        errors.roadTestType = 'Please select a road test type';
      }
      
      if (!formData.driveTestCentreId) {
        errors.driveTestCentreId = 'Please select a drive test centre';
      }
    } else if (currentStep === 2) {
      if (!formData.testDate) {
        errors.testDate = 'Please select a test date';
      }
      
      if (!formData.testTime) {
        errors.testTime = 'Please select a test time';
      }
    } else if (currentStep === 3 && !formData.meetAtCentre) {
      if (!formData.pickupAddress || !formData.pickupPostalCode) {
        errors.pickupAddress = 'Please enter a complete pickup address with postal code';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate all form fields
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.roadTestType) {
      errors.roadTestType = 'Please select a road test type';
    }
    
    if (!formData.driveTestCentreId) {
      errors.driveTestCentreId = 'Please select a drive test centre';
    }
    
    if (!formData.testDate) {
      errors.testDate = 'Please select a test date';
    }
    
    if (!formData.testTime) {
      errors.testTime = 'Please select a test time';
    }
    
    if (!formData.meetAtCentre) {
      if (!formData.pickupAddress || !formData.pickupPostalCode) {
        errors.pickupAddress = 'Please enter a complete pickup address with postal code';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = <K extends keyof SearchData>(field: K, value: SearchData[K]) => {
    if (field === 'roadTestType' && value !== formData.roadTestType) {
      // Reset addons when test type changes
      setShouldResetAddons(true);
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // If toggling meetAtCentre to true, clear pickup/dropoff fields
    if (field === 'meetAtCentre' && value === true) {
      setFormData(prev => ({
        ...prev,
        pickupAddress: '',
        pickupPostalCode: '',
        dropoffAddress: '',
        dropoffPostalCode: '',
        [field]: value,
      }));
    }
    
    // Clear any errors for the changed field
    if (formErrors[field as string]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[field as string];
        return updated;
      });
    }
  };

  const handleAddonsChange = (addons: Addon[]) => {
    setFormData(prev => ({
      ...prev,
      selectedAddons: addons,
    }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsCalculating(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setShowPricing(true);
        setIsCalculating(false);
        if (onSearch) {
          onSearch(formData);
        }
        
        // Scroll to pricing section
        if (pricingSectionRef.current) {
          pricingSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1000);
    }
  };

  // Calculate progress percentage based on current step
  const progressPercentage = (currentStep / 4) * 100;

  // Progress indicator for multi-step form
  const renderProgressIndicator = () => {
    return (
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">
            Step {currentStep} of 4
          </p>
          <p className="text-sm font-medium text-brand-600">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-brand-400 to-brand-500 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 bg-white backdrop-blur-sm transition-all ${className}`}>
      {/* Header */}
      <div 
        ref={headerRef}
        className={`relative bg-gradient-to-r from-brand-500 to-brand-400 text-white px-4 sm:px-8 py-6 transition-all duration-300 ${
          isSticky ? 'sticky top-0 z-50 py-3 shadow-md' : ''
        }`}
      >
        <div 
          className="flex flex-col md:flex-row md:items-center md:justify-between"
          style={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <div>
            <h2 className="font-bold text-xl md:text-2xl mb-1">Find Your Perfect Driving Test Package</h2>
            <p className="text-sm md:text-base text-brand-50">Book a car and instructor for your road test across Ontario</p>
          </div>
          
          {isSticky && showPricing && selectedCenter && (
            <div 
              className="mt-2 md:mt-0 bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center"
              style={{ opacity: 1, transform: 'scale(1)' }}
            >
              <span className="text-white font-medium mr-2">Total:</span>
              <span className="text-white font-bold text-lg">${totalPrice}</span>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8">
        {/* Progress bar */}
        {renderProgressIndicator()}
        
        {/* Multi-step form content */}
        <div className="transition-all duration-300">
          {currentStep === 1 && (
            <div
              className="space-y-6"
              style={{ opacity: 1, transform: 'translateX(0px)' }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Select Your Test Type & Centre
              </h3>
              
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4">
                    <Car className="h-5 w-5 text-brand-500" />
                  </div>
                  <RoadTestTypeSelect
                    value={formData.roadTestType}
                    onChange={(value) => handleChange('roadTestType', value)}
                    className="pl-12"
                  />
                  {formErrors.roadTestType && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.roadTestType}</p>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4">
                    <MapPin className="h-5 w-5 text-brand-500" />
                  </div>
                  <DriveTestCentreSelect
                    value={formData.driveTestCentreId}
                    onChange={(value) => handleChange('driveTestCentreId', value)}
                    className="pl-12"
                  />
                  {formErrors.driveTestCentreId && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.driveTestCentreId}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-500 hover:to-brand-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div
              className="space-y-6"
              style={{ opacity: 1, transform: 'translateX(0px)' }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Select Your Test Date & Time
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
                  <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-4">
                      <Calendar className="h-5 w-5 text-brand-500" />
                    </div>
                    <input
                      type="date"
                      value={formData.testDate}
                      onChange={(e) => handleChange('testDate', e.target.value)}
                      className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {formErrors.testDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.testDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Time</label>
                  <div className="relative">
                    <div className="absolute top-1/2 -translate-y-1/2 left-4">
                      <Clock className="h-5 w-5 text-brand-500" />
                    </div>
                    <input
                      type="time"
                      value={formData.testTime}
                      onChange={(e) => handleChange('testTime', e.target.value)}
                      className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-colors"
                    />
                  </div>
                  {formErrors.testTime && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.testTime}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-500 hover:to-brand-700 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Continue</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div
              className="space-y-6"
              style={{ opacity: 1, transform: 'translateX(0px)' }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Pickup & Dropoff Details
              </h3>
              
              <div className="px-1">
                <MeetAtCentreToggle
                  value={formData.meetAtCentre}
                  onChange={(value) => handleChange('meetAtCentre', value)}
                />
              </div>

              {!formData.meetAtCentre && (
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                    <AddressField
                      address={formData.pickupAddress}
                      postalCode={formData.pickupPostalCode}
                      onAddressChange={(value) => handleChange('pickupAddress', value)}
                      onPostalCodeChange={(value) => handleChange('pickupPostalCode', value)}
                      placeholder="Enter pickup address"
                    />
                    {formErrors.pickupAddress && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.pickupAddress}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Address</label>
                    <AddressField
                      address={formData.dropoffAddress}
                      postalCode={formData.dropoffPostalCode}
                      onAddressChange={(value) => handleChange('dropoffAddress', value)}
                      onPostalCodeChange={(value) => handleChange('dropoffPostalCode', value)}
                      placeholder="Enter dropoff address (optional)"
                      isRequired={false}
                    />
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center py-3 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-500 hover:to-brand-600 text-white font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Calculate Price</span>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div
              className="space-y-6"
              style={{ opacity: 1, transform: 'translateX(0px)' }}
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                Review & Confirm
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Your Test Details</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Test Type:</span>
                      <span className="font-medium text-gray-900">{formData.roadTestType}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Test Centre:</span>
                      <span className="font-medium text-gray-900">{selectedCenter?.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium text-gray-900">
                        {formData.testDate} at {formData.testTime}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium text-gray-900">
                        {formData.meetAtCentre ? 'Meet at Drive Test Centre' : 'Pickup & Dropoff'}
                      </span>
                    </li>
                    {!formData.meetAtCentre && formData.pickupAddress && (
                      <li className="flex justify-between">
                        <span className="text-gray-600">Pickup Address:</span>
                        <span className="font-medium text-gray-900">{formData.pickupAddress}</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                  <div className="flex items-center mb-2">
                    <Info className="h-4 w-4 text-brand-600 mr-2" />
                    <h4 className="text-sm font-medium text-brand-800">Available Benefits</h4>
                  </div>
                  <ul className="space-y-1">
                    {!formData.meetAtCentre && (
                      <>
                        <li className="flex items-center text-sm text-brand-700">
                          <Check className="h-4 w-4 text-brand-500 mr-2" />
                          {distance >= 50 ? 'Free dropoff included' : 'Affordable dropoff service'}
                        </li>
                        <li className="flex items-center text-sm text-brand-700">
                          <Check className="h-4 w-4 text-brand-500 mr-2" />
                          {distance >= 100 ? 'Free 1-hour driving lesson included' : 
                           distance >= 50 ? 'Free 30-minute driving lesson included' : 
                           'Add-on driving lessons available'}
                        </li>
                      </>
                    )}
                    <li className="flex items-center text-sm text-brand-700">
                      <Check className="h-4 w-4 text-brand-500 mr-2" />
                      Professional instructor & well-maintained vehicle
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="flex-1 py-4 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-500 hover:to-brand-700 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                >
                  {isCalculating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating Price...
                    </span>
                  ) : (
                    'Get My Best Price'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Help tip */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <p>Need help? Our support team is available 24/7</p>
        </div>
      </form>

      {/* Pricing Section */}
      {showPricing && selectedCenter && (
        <div className="border-t border-gray-200" ref={pricingSectionRef}>
          <PricingCalculationV2
            testType={formData.roadTestType}
            center={selectedCenter}
            meetAtCentre={formData.meetAtCentre}
            distance={distance}
            onAddonsChange={handleAddonsChange}
            selectedAddons={formData.selectedAddons}
            isLoading={isCalculating}
          />
        </div>
      )}

      {/* Meet at center info box */}
      {formData.meetAtCentre && selectedCenter && currentStep === 3 && (
        <div 
          className="bg-gradient-to-r from-blue-50 to-brand-50 p-6 border-t border-blue-100"
          style={{ opacity: 1, transform: 'translateY(0px)' }}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="flex-shrink-0 mb-4 hidden sm:block sm:mb-0 sm:mr-4">
              <div className="bg-brand-100 rounded-full p-3">
                <Info className="h-6 w-6 text-brand-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-brand-800">Unlock Premium Benefits!</h3>
              <div className="mt-2 text-brand-700">
                <p className="text-base">By selecting our pickup/dropoff service instead of meeting at the test center</p>
                <ul className="mt-3 space-y-2 pl-5">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-500 mt-1 mr-2 flex-shrink-0" />
                    <span className='text-black'>Free dropoff for distances over 50km</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-500 mt-1 mr-2 flex-shrink-0" />
                    <span className='text-black'>Free 30-minute driving lesson for distances over 50km</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-brand-500 mt-1 mr-2 flex-shrink-0" />
                    <span className='text-black'>Free 1-hour driving lesson for distances over 100km</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={() => handleChange('meetAtCentre', false)}
                    className="bg-brand-100 text-brand-800 px-4 py-2 rounded-lg text-sm font-medium border border-brand-300 hover:bg-brand-200 transition-colors transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Switch to pickup/dropoff service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}