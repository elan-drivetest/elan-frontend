'use client';

import { useState, useEffect, useRef } from 'react';
import { Addon } from '@/types/search';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';

type AddonsSelectorProps = {
  testType: string;
  selectedAddons: Addon[];
  onChange: (addons: Addon[]) => void;
  hasFreeLesson: boolean;
};

export default function AddonsSelector({
  testType,
  selectedAddons,
  onChange,
  hasFreeLesson,
}: AddonsSelectorProps) {
  const [hasUpgradedToMockTest, setHasUpgradedToMockTest] = useState(false);
  // Store the original free lesson in a ref to persist across renders
  const originalFreeLessonRef = useRef<Addon | null>(null);
  
  // Get lesson price based on test type
  const lessonPrice = testType === 'G2' ? 50 : 60;
  const mockTestUpgradePrice = testType === 'G2' ? 50 : 40; // G2: 100-50=50, Full G: 100-60=40
  
  // Find the free lesson type user has (if any)
  const freeLesson = selectedAddons.find(addon => addon.id === 'free-lesson');
  const hasFree30MinLesson = freeLesson && freeLesson.name.includes('30-Minute');
  const hasFree1HrLesson = freeLesson && freeLesson.name.includes('1-Hour');
  
  // Store the original free lesson when it first appears
  useEffect(() => {
    if (freeLesson && !originalFreeLessonRef.current) {
      originalFreeLessonRef.current = { ...freeLesson };
    }
  }, [freeLesson]);
  
  // Define available addons based on test type
  const availableAddons: Addon[] = [
    {
      id: 'mock-test',
      name: `${testType} Mock Test`,
      price: 100,
      originalPrice: 100,
      description: 'Practice your test with our experienced instructors',
    },
    {
      id: 'lesson-1hr',
      name: `${testType} Lesson (1 hour)`,
      price: lessonPrice,
      originalPrice: lessonPrice,
      description: hasFree1HrLesson 
        ? 'You already have a free 1-hour lesson'
        : hasFree30MinLesson
          ? 'Available as a free lesson if pickup is 100km+'
          : 'One-on-one lesson with a professional instructor',
      disabled: hasFree30MinLesson || hasFree1HrLesson,
    },
  ];

  // Check if user has a mock test selected (including both regular and upgraded)
  const hasMockTest = selectedAddons.some(addon => addon.id === 'mock-test');
  
  // Check if user has a lesson selected
  const hasLesson = selectedAddons.some(addon => addon.id === 'lesson-1hr' || addon.id === 'free-lesson');

  // Effect to check if mock test upgrade has been done
  useEffect(() => {
    const mockTest = selectedAddons.find(addon => addon.id === 'mock-test' && addon.name.includes('Upgraded'));
    if (mockTest) {
      setHasUpgradedToMockTest(true);

      // If we have an upgraded mock test but no saved free lesson, check PricingCalculation's state
      if (!originalFreeLessonRef.current && hasFreeLesson) {
        // Create a default free lesson based on the test type
        // This helps if the user refreshes or comes back to the page
        const defaultFreeLesson: Addon = {
          id: 'free-lesson',
          name: `Free 1-Hour ${testType} Driving Lesson`,
          price: 0,
          originalPrice: lessonPrice,
          description: 'Included as a free perk for 100km+ pickup distance'
        };
        
        originalFreeLessonRef.current = defaultFreeLesson;
      }
    } else {
      setHasUpgradedToMockTest(false);
    }
  }, [selectedAddons, hasFreeLesson, testType, lessonPrice]);

  // Convert free lesson to mock test
  const upgradeLessonToMockTest = () => {
    // Only proceed if not already upgraded
    if (hasUpgradedToMockTest) return;
    
    // Find free lesson in selected addons
    const freeLesson = selectedAddons.find(addon => addon.id === 'free-lesson');
    
    if (freeLesson) {
      // Save the original free lesson
      if (!originalFreeLessonRef.current) {
        originalFreeLessonRef.current = { ...freeLesson };
      }
      
      // Get the appropriate upgrade price based on the free lesson type and test type
      let upgradePrice = mockTestUpgradePrice;
      
      if (freeLesson.name.includes('30-Minute')) {
        // 30-min lesson is worth half the full lesson price
        upgradePrice = testType === 'G2' ? 75 : 70; // 100 - (50/2) = 75 or 100 - (60/2) = 70
      } else {
        // 1-hour lesson 
        upgradePrice = testType === 'G2' ? 50 : 40; // 100 - 50 = 50 or 100 - 60 = 40
      }
      
      // Remove free lesson and any other lesson or mock test
      const filteredAddons = selectedAddons.filter(addon => 
        addon.id !== 'free-lesson' && 
        addon.id !== 'lesson-1hr' && 
        addon.id !== 'mock-test'
      );
      
      // Add upgraded mock test with appropriate price adjustment
      const mockTest: Addon = {
        id: 'mock-test',
        name: `${testType} Mock Test (Upgraded)`,
        price: upgradePrice,
        originalPrice: 100,
        description: 'Upgraded from free lesson',
      };
      
      onChange([...filteredAddons, mockTest]);
      setHasUpgradedToMockTest(true);
    }
  };

  // Toggle addon selection
  const toggleAddon = (addon: Addon) => {
    // If it's a mock test and we already have an upgraded mock test, don't allow toggling
    if (addon.id === 'mock-test' && hasUpgradedToMockTest && !selectedAddons.some(a => a.id === 'mock-test' && !a.name.includes('Upgraded'))) {
      return;
    }
    
    // If we're trying to add a lesson and user already has a free 1-hour lesson, don't allow
    if (addon.id === 'lesson-1hr' && hasFree1HrLesson) {
      return;
    }
    
    const addonIndex = selectedAddons.findIndex(a => a.id === addon.id);
    
    if (addonIndex >= 0) {
      // Remove addon
      const updatedAddons = [...selectedAddons];
      updatedAddons.splice(addonIndex, 1);
      onChange(updatedAddons);
    } else {
      // Check if we're adding a mock test but already have a lesson
      if (addon.id === 'mock-test' && hasLesson) {
        // Remove lesson before adding mock test (but preserve free lesson)
        const updatedAddons = selectedAddons.filter(a => !(a.id === 'lesson-1hr' || (a.id === 'free-lesson' && a.price > 0)));
        onChange([...updatedAddons, addon]);
        return;
      }
      
      // Check if we're adding a lesson but already have a mock test
      if (addon.id === 'lesson-1hr' && hasMockTest) {
        // Remove mock test before adding lesson
        const updatedAddons = selectedAddons.filter(a => a.id !== 'mock-test');
        onChange([...updatedAddons, addon]);
        return;
      }
      
      // Normal case: just add the addon
      onChange([...selectedAddons, addon]);
    }
  };

  // Check if an addon is selected
  const isSelected = (addonId: string) => {
    return selectedAddons.some(addon => addon.id === addonId);
  };

  // Check if user has a downgrade option from mock test to free lesson
  // const canDowngradeToFreeLesson = hasUpgradedToMockTest && originalFreeLessonRef.current;
  
  // Downgrade from mock test back to the original free lesson
  const downgradeToFreeLesson = () => {
    if (!originalFreeLessonRef.current) {
      return;
    }
    
    // Remove the mock test
    const filteredAddons = selectedAddons.filter(addon => addon.id !== 'mock-test');
    
    // Re-add the original free lesson
    onChange([...filteredAddons, originalFreeLessonRef.current]);
    setHasUpgradedToMockTest(false);
  };

  return (
    <div className="space-y-6">
      {hasFreeLesson && !hasUpgradedToMockTest && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-blue-800">You have a free driving lesson!</h4>
              <div className="mt-2 text-sm text-blue-700">
                <p>Want to use your free lesson for a mock test instead?</p>
                <button 
                  type="button"
                  onClick={upgradeLessonToMockTest}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  Upgrade to Mock Test 
                  <span className="ml-1 bg-blue-500 px-2 py-1 rounded-md text-xs">+${mockTestUpgradePrice}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableAddons.map((addon) => {
          const isDisabled = (
            // Disable mock test if already upgraded
            (addon.id === 'mock-test' && hasUpgradedToMockTest && !isSelected('mock-test')) ||
            // Disable lesson if mock test selected
            (addon.id === 'lesson-1hr' && hasMockTest) ||
            // Disable mock test if lesson selected
            (addon.id === 'mock-test' && hasLesson) ||
            // Disable lesson if user already has a free 1-hour lesson
            (addon.id === 'lesson-1hr' && hasFree1HrLesson) ||
            // If addon has explicit disabled property
            addon.disabled === true
          );
          
          return (
            <div 
              key={addon.id}
              className={`
                relative rounded-xl border p-5 transition-all
                ${isSelected(addon.id) 
                  ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                  : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => !isDisabled && toggleAddon(addon)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{addon.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{addon.description}</p>
                  
                  {(addon.id === 'mock-test' && hasLesson && !hasUpgradedToMockTest) ? (
                    <div className="flex items-center mt-2 text-xs text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <p>{"You can't select both lessons and mock test."}</p>
                    </div>
                  ) : null}
                  
                  {(addon.id === 'lesson-1hr' && hasMockTest) ? (
                    <div className="flex items-center mt-2 text-xs text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <p>{"You can't select both lessons and mock test."}</p>
                    </div>
                  ) : null}
                  
                  {(addon.id === 'mock-test' && hasUpgradedToMockTest && !isSelected('mock-test')) && (
                    <div className="flex items-center mt-2 text-xs text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <p>{"You've already upgraded to a mock test."}</p>
                    </div>
                  )}
                  
                  {(addon.id === 'lesson-1hr' && hasFree1HrLesson) && (
                    <div className="flex items-center mt-2 text-xs text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <p>You already have a free 1-hour lesson included!</p>
                    </div>
                  )}
                  
                  {(addon.id === 'lesson-1hr' && hasFree30MinLesson) && (
                    <div className="flex items-center mt-2 text-xs text-blue-600">
                      <Info className="h-4 w-4 mr-1" />
                      <p>For free 1-hour lessons, pickup must be 100km+ away.</p>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <span className="text-lg font-bold text-emerald-600">${addon.price}</span>
                </div>
              </div>
              
              <div className={`absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center ${isSelected(addon.id) ? 'bg-emerald-500' : 'border-2 border-gray-300'}`}>
                {isSelected(addon.id) && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.72 6.96l1.44 1.44 3.12-3.12-1.44-1.44-1.68 1.68-.72-.72L3 6.24l.72.72z" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show information about currently selected upgraded mock test */}
      {hasUpgradedToMockTest && originalFreeLessonRef.current && (
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-3">
              <h4 className="text-base font-medium text-purple-800">Want to go back to your free lesson?</h4>
              <div className="mt-2 text-sm text-purple-700">
                <p>You can revert back to your original free {originalFreeLessonRef.current.name.includes('30-Minute') ? '30-minute' : '1-hour'} lesson.</p>
                <button 
                  type="button"
                  onClick={downgradeToFreeLesson}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  Return to Free Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}