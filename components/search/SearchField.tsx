'use client';

import { SearchFieldProps } from '@/types/search';

export default function SearchField({
  label,
  secondaryLabel,
  value,
  onChange,
  type = 'text',
  className = '',
  placeholder = '',
}: SearchFieldProps) {
  return (
    <div className={`flex flex-col p-4 ${className}`}>
      <div className="text-sm text-gray-700 font-medium mb-1">
        {label}
        {secondaryLabel && (
          <span className="text-xs text-gray-500 ml-1">
            {secondaryLabel}
          </span>
        )}
      </div>
      
      <input
        type={type}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none text-gray-800 w-full"
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}