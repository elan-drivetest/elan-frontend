'use client';

import { useState, useEffect, useRef } from 'react';
import { Addon } from '@/types/search';
import { Info, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AddonsSelectorV2Props = {
  testType: string;
  selectedAddons: Addon[];
  onChange: (addons: Addon[]) => void;
  hasFreeLesson: boolean;
};

export default function AddonsSelectorV2({
  testType,
  selectedAddons,
  onChange,
  hasFreeLesson,
}: AddonsSelectorV2Props) {
  const [hasUpgradedToMockTest, setHasUpgradedToMockTest] = useState(false);
  // Store the original free lesson in a ref to persist across renders
  const originalFreeLessonRef = useRef<Addon | null>(null);
  
  // Get lesson price based on test type
  const lessonPrice = testType === 'G2' ? 50 : 60;
  const mockTestUpgradePrice30Min = 50; // Fixed at $50 for 30min upgrade
  const mockTestUpgradePrice1Hr = 40; // Fixed at $40 for 1hr upgrade
  
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
      
      // Get the appropriate upgrade price based on the free lesson type
      const upgradePrice = freeLesson.name.includes('30-Minute') 
        ? mockTestUpgradePrice30Min 
        : mockTestUpgradePrice1Hr;
      
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
    <div className="space-y-5">
      {/* Free Lesson Upgrade Offer */}
      {hasFreeLesson && !hasUpgradedToMockTest && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">You have a free driving lesson!</h4>
              <p className="mt-1 text-sm text-gray-600">
                Want to use your free {hasFree30MinLesson ? '30-minute' : '1-hour'} lesson for a mock test instead?
              </p>
              <button 
                type="button"
                onClick={upgradeLessonToMockTest}
                className="mt-3 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Upgrade to Mock Test 
                <span className="ml-1 bg-gray-700 px-2 py-0.5 rounded text-xs">
                  +${hasFree30MinLesson ? mockTestUpgradePrice30Min : mockTestUpgradePrice1Hr}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              onClick={() => !isDisabled && toggleAddon(addon)}
              className={cn(
                "relative rounded-lg border p-4 transition-all",
                isSelected(addon.id) 
                  ? 'border-gray-400 bg-gray-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              )}
            >
              <div className="flex justify-between items-start">
                <div className="pr-6">
                  <h4 className="font-medium text-gray-800">{addon.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
                  
                  {/* Conditional messages */}
                  {(addon.id === 'mock-test' && hasLesson && !hasUpgradedToMockTest) && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <AlertCircle className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <p>{"Can't select with active lesson"}</p>
                    </div>
                  )}
                  
                  {(addon.id === 'lesson-1hr' && hasMockTest) && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <AlertCircle className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <p>{"Can't select with active mock test"}</p>
                    </div>
                  )}
                  
                  {(addon.id === 'mock-test' && hasUpgradedToMockTest && !isSelected('mock-test')) && (
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <AlertCircle className="h-3.5 w-3.5 text-gray-400 mr-1" />
                      <p>Already upgraded to mock test</p>
                    </div>
                  )}
                  
                  {(addon.id === 'lesson-1hr' && hasFree1HrLesson) && (
                    <div className="flex items-center mt-2 text-xs text-green-600">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      <p>Free 1-hour lesson included</p>
                    </div>
                  )}
                  
                  {(addon.id === 'lesson-1hr' && hasFree30MinLesson) && (
                    <div className="flex items-center mt-2 text-xs text-blue-600">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      <p>Free 1-hour for 100km+ distance</p>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-lg font-medium text-gray-900">${addon.price}</span>
                </div>
              </div>
              
              {/* Checkbox indicator */}
              <div className={cn(
                "absolute top-4 right-4 h-4 w-4 rounded-full flex items-center justify-center",
                isSelected(addon.id) ? 'bg-gray-800' : 'border border-gray-300'
              )}>
                {isSelected(addon.id) && (
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M3.72 6.96l1.44 1.44 3.12-3.12-1.44-1.44-1.68 1.68-.72-.72L3 6.24l.72.72z" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Downgrade Option */}
      {hasUpgradedToMockTest && originalFreeLessonRef.current && (
        <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Want to go back to your free lesson?</h4>
              <p className="mt-1 text-sm text-gray-600">
                You can revert to your original free {originalFreeLessonRef.current.name.includes('30-Minute') ? '30-minute' : '1-hour'} lesson.
              </p>
              <button 
                type="button"
                onClick={downgradeToFreeLesson}
                className="mt-3 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
              >
                Return to Free Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}