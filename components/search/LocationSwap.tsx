'use client';

type LocationSwapProps = {
  onSwap: () => void;
};

export default function LocationSwap({ onSwap }: LocationSwapProps) {
  return (
    <button
      type="button"
      onClick={onSwap}
      className="absolute right-3 bottom-4 text-[#009D6C] hover:text-[#007a54] transition-colors bg-white rounded-full p-1 shadow-sm"
      aria-label="Swap locations"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 16V4M7 4L3 8M7 4L11 8" />
        <path d="M17 8V20M17 20L21 16M17 20L13 16" />
      </svg>
    </button>
  );
}