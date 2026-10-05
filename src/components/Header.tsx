import React from 'react';
import { ShoppingBag, Truck, Search, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface HeaderProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItems,
  onOpenCart,
  onOpenTracker,
  onNavigate,
  activeSection,
  onSearchClick,
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EFECE6] transition-colors">
      {/* Top micro announcement */}
      <div className="bg-[#23382B] text-[#E8F0EA] px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-[#A3C8B0]" />
        <span>Fresh Hand-Cut Blooms · Same-Day Delivery in NYC & Suburbs · Climate-Controlled Courier</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Zone 1: Single text element Brand Zone */}
          <button
            onClick={() => onNavigate('hero')}
            className="text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23382B]"
          >
            <span className="font-display text-2xl sm:text-3xl tracking-tight text-[#1F1E1D] group-hover:text-[#23382B] transition-colors font-medium">
              Pétale & Tige
            </span>
          </button>

          {/* Zone 2: 4-6 text links with subtle hover underlines */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A5652]">
            <button
              onClick={() => onNavigate('catalog')}
              className={`transition-colors hover:text-[#1F1E1D] pb-1 border-b-2 ${
                activeSection === 'catalog' ? 'border-[#23382B] text-[#1F1E1D]' : 'border-transparent'
              }`}
            >
              Artisanal Catalog
            </button>
            <button
              onClick={() => onNavigate('delivery-info')}
              className={`transition-colors hover:text-[#1F1E1D] pb-1 border-b-2 ${
                activeSection === 'delivery-info' ? 'border-[#23382B] text-[#1F1E1D]' : 'border-transparent'
              }`}
            >
              Delivery Scheduling
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className={`transition-colors hover:text-[#1F1E1D] pb-1 border-b-2 flex items-center gap-1.5 ${
                activeSection === 'tracker' ? 'border-[#23382B] text-[#1F1E1D]' : 'border-transparent'
              }`}
            >
              <Truck className="w-4 h-4 text-[#23382B]" />
              <span>Track Order</span>
            </button>
            <button
              onClick={() => onNavigate('reviews')}
              className={`transition-colors hover:text-[#1F1E1D] pb-1 border-b-2 ${
                activeSection === 'reviews' ? 'border-[#23382B] text-[#1F1E1D]' : 'border-transparent'
              }`}
            >
              Customer Reviews
            </button>
            <button
              onClick={() => onNavigate('craft')}
              className={`transition-colors hover:text-[#1F1E1D] pb-1 border-b-2 ${
                activeSection === 'craft' ? 'border-[#23382B] text-[#1F1E1D]' : 'border-transparent'
              }`}
            >
              Our Atelier
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSearchClick}
              aria-label="Search catalog"
              className="p-2 text-[#5A5652] hover:text-[#1F1E1D] hover:bg-[#F2EFE9] rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenTracker}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#23382B] bg-[#EBF1ED] hover:bg-[#DEE8E1] rounded-md transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Order Tracking</span>
            </button>

            <button
              onClick={onOpenCart}
              aria-label={`View shopping cart with ${totalCartCount} items`}
              className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#23382B] hover:bg-[#1B2B21] rounded-lg transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {totalCartCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-[#D98A74] text-white rounded-full">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
