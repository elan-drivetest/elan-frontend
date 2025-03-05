'use client';

import { useState, useEffect } from 'react';
import { SearchFormProps, SearchData, DriveTestCenter, Addon } from '@/types/search';
import { CanadianLocations } from '@/data/locations';
import PricingCalculation from './PricingCalculation';
import AddressField from './AddressField';
import MeetAtCentreToggle from './MeetAtCentreToggle';
import DriveTestCentreSelect from './DriveTestCentreSelect';
import RoadTestTypeSelect from './RoadTestTypeSelect';
import { Calendar, Car, Clock, MapPin } from 'lucide-react';

export default function SearchForm({
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

  // Validate form fields
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
      }, 1000);
    }
  };

  return (
    <div className={`w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 bg-white backdrop-blur-sm ${className}`}>
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-6">
        <h2 className="font-bold text-2xl">Find Your Perfect Driving Test Package</h2>
        <p className="mt-2 text-emerald-50">Book a car and instructor for your road test across Ontario</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Test Type & Center Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-4">
                <Car className="h-5 w-5 text-emerald-500" />
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
                <MapPin className="h-5 w-5 text-emerald-500" />
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

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Date</label>
              <div className="relative">
                <div className="absolute top-1/2 -translate-y-1/2 left-4">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  type="date"
                  value={formData.testDate}
                  onChange={(e) => handleChange('testDate', e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
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
                  <Clock className="h-5 w-5 text-emerald-500" />
                </div>
                <input
                  type="time"
                  value={formData.testTime}
                  onChange={(e) => handleChange('testTime', e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>
              {formErrors.testTime && (
                <p className="mt-1 text-sm text-red-600">{formErrors.testTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Meet at center toggle */}
        <div className="px-1">
          <MeetAtCentreToggle
            value={formData.meetAtCentre}
            onChange={(value) => handleChange('meetAtCentre', value)}
          />
        </div>

        {/* Address Fields */}
        {!formData.meetAtCentre && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-xl">
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Calculating Your Best Price...
              </span>
            ) : (
              'Find My Perfect Package'
            )}
          </button>
        </div>
      </form>

      {/* Pricing Section */}
      {showPricing && selectedCenter && (
        <div className="border-t border-gray-200">
          <PricingCalculation
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
      {formData.meetAtCentre && selectedCenter && (
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 p-6 border-t border-blue-100">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-emerald-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-emerald-800">Unlock Premium Benefits!</h3>
              <div className="mt-2 text-emerald-700">
                <p className="text-base">By selecting our pickup/dropoff service instead of meeting at the test center:</p>
                <ul className="mt-3 space-y-2 pl-5">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free dropoff for distances over 50km</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free 30-minute driving lesson for distances over 50km</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free 1-hour driving lesson for distances over 100km</span>
                  </li>
                </ul>
                <div className="mt-4">
                  <button 
                    type="button" 
                    onClick={() => handleChange('meetAtCentre', false)}
                    className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
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