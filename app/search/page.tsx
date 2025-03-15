import SearchContainerV2 from '@/components/search/SearchContainerV2';
import Navbar from '@/components/layout/Navbar';

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-6 sm:px-6 lg:px-8">
        
        <SearchContainerV2 />
        
        <div className="mt-16 bg-gray-200 p-8 text-center rounded-lg">
          <h2 className="text-xl font-medium">Need Help?</h2>
          <p className="mt-2">Our support team is available to assist you with your booking.</p>
          <button className="mt-4 bg-[#009D6C] text-white px-6 py-2 rounded-md hover:bg-[#008058] transition-colors">
            Contact Support
          </button>
        </div>
      </main>
      
      <footer className="mt-auto w-full bg-gray-100 p-6 text-center text-gray-600">
        <p className="text-sm">© 2025 Elan - Drivetest Car Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}