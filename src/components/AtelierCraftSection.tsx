import React from 'react';
import { Sparkles, Heart, Shield, Leaf } from 'lucide-react';

export const AtelierCraftSection: React.FC = () => {
  return (
    <section id="craft" className="py-16 bg-[#FAF9F6] border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7770]">
              The Pétale & Tige Philosophy
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight">
              Rooted in Dutch Golden Age aesthetics & regenerative horticulture.
            </h2>

            <p className="text-sm text-[#5D5750] leading-relaxed">
              Founded in 2021 by floral designer Éléonore Laurent, Pétale & Tige was created as an antidote to plastic-wrapped, chemically preserved commercial blooms. We partner exclusively with boutique organic growers across North America and Europe.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF1ED] text-[#23382B] flex items-center justify-center shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1F1E1D]">100% Floral Foam-Free Atelier</h4>
                  <p className="text-xs text-[#6B655E] mt-0.5">
                    We never use microplastic floral foam (Oasis). All vessels utilize chicken wire mechanics and natural river pebbles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAF1EC] text-[#C47053] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1F1E1D]">Cold-Chain Hydration Delivery</h4>
                  <p className="text-xs text-[#6B655E] mt-0.5">
                    Stems are never dry-packed in cardboard boxes. Stems arrive upright in nutrient water pouches to preserve bloom cell vitality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF1ED] text-[#23382B] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#1F1E1D]">7-Day Freshness Replacement Guarantee</h4>
                  <p className="text-xs text-[#6B655E] mt-0.5">
                    If your blooms do not thrive for at least seven days with proper care, we dispatch a fresh complimentary arrangement with zero questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white p-8 rounded-2xl border border-[#E5E0D8] shadow-xs space-y-6">
            <h3 className="font-display text-2xl text-[#1F1E1D] font-medium">Atelier Visiting Hours & Studio Pickups</h3>
            <p className="text-xs text-[#6B655E] leading-relaxed">
              While our core studio specializes in direct-to-door delivery, guests are warmly welcome to visit our greenhouse showroom for custom consultations and vessel sourcing.
            </p>

            <div className="space-y-3 text-xs border-y border-[#EFECE6] py-4">
              <div className="flex justify-between">
                <span className="text-[#6B655E]">Monday – Friday</span>
                <span className="font-mono font-medium text-[#1F1E1D]">08:00 AM – 06:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B655E]">Saturday</span>
                <span className="font-mono font-medium text-[#1F1E1D]">09:00 AM – 05:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B655E]">Sunday Delivery & Showroom</span>
                <span className="font-mono font-medium text-[#1F1E1D]">10:00 AM – 03:00 PM</span>
              </div>
            </div>

            <div className="text-xs text-[#68625B]">
              <strong className="text-[#1F1E1D] block mb-1">Studio Address</strong>
              <span>184 Franklin Street, Tribeca, New York, NY 10013</span>
              <span className="block text-[11px] text-[#888] mt-0.5">Direct Florist Concierge: +1 (555) 892-0194</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
