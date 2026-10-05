import React from 'react';
import { Calendar, Clock, Sparkles, ShieldCheck } from 'lucide-react';
import heroImg from '../assets/images/hero_floral_atelier_1791194578786.jpg';

interface HeroBannerProps {
  onExploreCatalog: () => void;
  onTrackOrder: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCatalog, onTrackOrder }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#EFECE6] pt-8 pb-16 lg:pt-14 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6E6862]">
              <span>Spring / Summer 2026 Collection</span>
              <span aria-hidden="true">·</span>
              <span>Artisanal Botanical Atelier</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-[#1F1E1D] font-normal tracking-tight">
              Flowers composed like poetry, delivered with devoted precision.
            </h1>

            <p className="text-base sm:text-lg text-[#5E5953] leading-relaxed max-w-xl">
              Fresh farm-harvested stems conditioned at dawn by master florists. Choose your preferred delivery date and time slot, write a bespoke handwritten greeting card, and track your bouquet with live temperature-controlled courier routing.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCatalog}
                className="px-6 py-3.5 bg-[#23382B] text-white text-sm font-medium rounded-lg hover:bg-[#1A2C21] transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                Browse Botanical Catalog
              </button>
              <button
                onClick={onTrackOrder}
                className="px-6 py-3.5 bg-[#FAF9F6] border border-[#DDD8D0] text-[#282725] text-sm font-medium rounded-lg hover:bg-[#F3EFE9] transition-colors cursor-pointer flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#23382B]" />
                <span>Track Existing Order</span>
              </button>
            </div>

            {/* Social Proof & Value Props (Claim-to-Proof Adjacency) */}
            <div className="pt-6 border-t border-[#EAE6DF] grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1E1D]">
                  <Calendar className="w-4 h-4 text-[#23382B]" />
                  <span>Flexible Dates</span>
                </div>
                <p className="text-xs text-[#7A746E] mt-1">Same-day or up to 30 days scheduled delivery</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1E1D]">
                  <Sparkles className="w-4 h-4 text-[#C47053]" />
                  <span>7-Day Guarantee</span>
                </div>
                <p className="text-xs text-[#7A746E] mt-1">Stem freshness & cold hydration pledge</p>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F1E1D]">
                  <ShieldCheck className="w-4 h-4 text-[#23382B]" />
                  <span>Live Courier GPS</span>
                </div>
                <p className="text-xs text-[#7A746E] mt-1">Real-time status, temperature & ETA</p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Anchor with Measured Scrim */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E5E0D8] bg-[#F0ECE4] aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={heroImg}
                alt="Artisanal flower arrangement in fluted ceramic vase at Pétale & Tige atelier"
                className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-md rounded-xl border border-white/60 shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#68625B]">Featured Today</p>
                  <p className="font-display text-lg text-[#1F1E1D] font-medium">The Florist’s Daily Harvest</p>
                  <p className="text-xs text-[#68625B]">Hand-tied garden roses, ranunculus & sweet peas</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#78716A] line-through mr-1.5">$92</span>
                  <span className="font-display text-xl font-semibold text-[#23382B] tabular-nums">$82</span>
                  <button
                    onClick={onExploreCatalog}
                    className="block mt-1 text-xs font-semibold text-[#C47053] hover:underline"
                  >
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
