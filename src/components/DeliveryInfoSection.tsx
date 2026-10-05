import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, ShieldCheck, Thermometer, Droplets } from 'lucide-react';

interface DeliveryInfoSectionProps {
  onScheduleNow: () => void;
}

export const DeliveryInfoSection: React.FC<DeliveryInfoSectionProps> = ({ onScheduleNow }) => {
  return (
    <section id="delivery-info" className="py-16 bg-white border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7770] mb-2 flex items-center justify-center gap-1.5">
            <Clock className="w-4 h-4 text-[#23382B]" />
            <span>Dedicated White-Glove Floral Logistics</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight">
            Delivery Scheduling & Freshness Pledge
          </h2>
          <p className="text-sm text-[#666059] mt-3 leading-relaxed">
            We don't outsource delicate stems to generic courier networks. Every bouquet is transported in our proprietary climate-controlled eco vans, protected by stem hydration packs.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#EAE6DF] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#23382B] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl text-[#1F1E1D] font-medium">Select Any Date Up to 30 Days Ahead</h3>
            <p className="text-xs text-[#635D56] leading-relaxed">
              Plan anniversaries, birthdays, and celebrations in advance. We source stems specifically for your scheduled date, arriving at peak unfurling stage. Same-day delivery available for orders placed by 4:00 PM.
            </p>
          </div>

          <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#EAE6DF] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF1EC] text-[#C47053] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl text-[#1F1E1D] font-medium">Three Daily Delivery Windows</h3>
            <p className="text-xs text-[#635D56] leading-relaxed">
              Choose Morning (9:00 AM – 12:00 PM), Afternoon (1:00 PM – 5:00 PM), or Evening (6:00 PM – 9:00 PM). Receive real-time SMS notifications with live courier ETA down to the minute.
            </p>
          </div>

          <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#EAE6DF] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF1ED] text-[#23382B] flex items-center justify-center">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="font-display text-xl text-[#1F1E1D] font-medium">14°C Climate-Controlled Fleet</h3>
            <p className="text-xs text-[#635D56] leading-relaxed">
              Flowers never wilt in hot trucks or freeze in winter chills. Our electric sprinter vehicles maintain a constant 14°C humidity-balanced environment, paired with bio-degradable stem hydration gel.
            </p>
          </div>

        </div>

        {/* Schedule Call to Action bar */}
        <div className="bg-[#23382B] text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-2xl font-medium">Ready to reserve a delivery window?</h4>
            <p className="text-xs text-[#D0E2D6]">
              All deliveries include complimentary calligraphy greeting card and flower nourishment sachet.
            </p>
          </div>
          <button
            onClick={onScheduleNow}
            className="px-6 py-3 bg-[#FAF9F6] text-[#23382B] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-white transition-all shadow-sm shrink-0 cursor-pointer"
          >
            Explore Catalog & Schedule
          </button>
        </div>

      </div>
    </section>
  );
};
