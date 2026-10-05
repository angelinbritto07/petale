import React from 'react';
import { ShieldCheck, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTracker }) => {
  return (
    <footer className="bg-[#1F2722] text-[#E0E7E2] py-14 border-t border-[#2F3C34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#2E3C32]">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <span className="font-display text-2xl tracking-tight text-white font-medium block">
              Pétale & Tige
            </span>
            <p className="text-xs text-[#9EAEA1] leading-relaxed">
              Artisanal floral boutique offering farm-fresh botanical compositions, flexible delivery scheduling, and live GPS courier tracking.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#C5D8C9]">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Botanical Catalog
            </h4>
            <ul className="space-y-2 text-xs text-[#A8B8AB]">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Seasonal Harvest
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Sarah Bernhardt Peonies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Midnight Velvet Noir Roses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Kyoto Phalaenopsis Orchids
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Logistics & Care
            </h4>
            <ul className="space-y-2 text-xs text-[#A8B8AB]">
              <li>
                <button onClick={onOpenTracker} className="hover:text-white transition-colors">
                  Live Order Tracking System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery-info')} className="hover:text-white transition-colors">
                  Delivery Time Slots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('reviews')} className="hover:text-white transition-colors">
                  Customer Reviews & Ratings
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('craft')} className="hover:text-white transition-colors">
                  Flower Longevity Care Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Floral Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Seasonal Journal
            </h4>
            <p className="text-xs text-[#9EAEA1]">
              Receive monthly bloom harvest updates and florist styling guides.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-xs bg-[#2B3830] border border-[#3D4F44] rounded-lg text-white placeholder-[#788E80] focus:outline-none focus:ring-1 focus:ring-[#A3C8B0]"
              />
              <button className="px-3.5 py-2 bg-[#FAF9F6] text-[#1F2722] text-xs font-semibold rounded-lg hover:bg-white transition-colors cursor-pointer shrink-0">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#899B8E] gap-4">
          <p>© {new Date().getFullYear()} Pétale & Tige Floral Atelier LLC. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Tribeca Studio & Eco Fleet</span>
            <span>·</span>
            <span>100% Bloom Quality Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
