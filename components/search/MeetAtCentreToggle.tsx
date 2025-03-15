'use client';

import { MapPin, Navigation } from 'lucide-react';

type MeetAtCentreToggleProps = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export default function MeetAtCentreToggle({ value, onChange }: MeetAtCentreToggleProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-brand-50 rounded-xl shadow-sm">
      <div className="md:max-w-[70%]">
        <div className="flex items-center">
          {value ? (
            <MapPin className="h-6 w-6 text-brand-500 mr-2" />
          ) : (
            <Navigation className="h-6 w-6 text-brand-500 mr-2" />
          )}
          <h3 className="text-lg font-medium text-gray-900">
            {value ? "Meet at Drive Test Centre" : "Pickup & Dropoff Service"}
          </h3>
        </div>
        <p className="text-gray-600 mt-1">
          {value 
            ? "You'll meet our instructor directly at the test centre" 
            : "Our instructor will pick you up from your location and drop you off after the test"}
        </p>
        {!value && (
          <div className="mt-2 text-sm text-brand-700 flex items-center">
            <svg className="h-4 w-4 text-brand-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Free perks available for longer distances!
          </div>
        )}
      </div>
      <div className="flex flex-col items-end mt-4 md:mt-0">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className="relative inline-flex h-8 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          style={{ backgroundColor: !value ? '#10b981' : '#6366f1' }}
          role="switch"
          aria-checked={value}
        >
          <span className="sr-only">Meet at Drive Test Centre</span>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${value ? 'translate-x-8' : 'translate-x-0'}
            `}
          />
        </button>
        <div className="mt-2 text-center text-xs font-medium">
          <span className={!value ? 'text-brand-600' : 'text-gray-500'}>Pickup service</span>
          <span className="px-1 text-gray-400">|</span>
          <span className={!!value ? 'text-indigo-600' : 'text-gray-500'}>Meet there</span>
        </div>
      </div>
    </div>
  );
}