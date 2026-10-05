import React, { useState } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Thermometer,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
  Navigation,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrderTrackerSectionProps {
  orders: Order[];
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
}

export const OrderTrackerSection: React.FC<OrderTrackerSectionProps> = ({
  orders,
  selectedOrderId,
  onSelectOrder,
  onAdvanceOrderStatus,
}) => {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const [courierNote, setCourierNote] = useState<string>('');
  const [noteSent, setNoteSent] = useState<boolean>(false);

  // Active tracked order
  const activeOrder = orders.find((o) => o.id.toLowerCase() === (selectedOrderId || '').toLowerCase()) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const term = searchInput.trim().toUpperCase();
    if (!term) return;

    // Search by ID or phone number
    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === term ||
        o.id.replace('PT-', '') === term.replace('PT-', '') ||
        o.delivery.recipientPhone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))
    );

    if (found) {
      onSelectOrder(found.id);
      setSearchInput('');
    } else {
      setSearchError(`No order found matching "${searchInput}". Please check your order ID (e.g. PT-89412).`);
    }
  };

  const handleSendCourierNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierNote.trim()) return;
    setNoteSent(true);
    setTimeout(() => {
      setCourierNote('');
      setNoteSent(false);
    }, 2500);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'out_for_delivery':
        return 'text-sky-700 bg-sky-50 border-sky-200';
      case 'arranging':
      case 'inspected':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      default:
        return 'text-neutral-700 bg-neutral-100 border-neutral-200';
    }
  };

  return (
    <section id="tracker" className="py-16 bg-[#FAF9F6] border-b border-[#EFECE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7E7770] mb-2 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#23382B]" />
            <span>Live Dispatch & Stem Cold-Chain Tracking</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1F1E1D] font-normal tracking-tight">
            Order Status & Real-Time Courier Tracking
          </h2>
          <p className="text-sm text-[#666059] mt-2">
            Track your artisanal bouquet from morning stem hydration and master floral arrangement through temperature-controlled courier delivery.
          </p>
        </div>

        {/* Search Bar & Quick Test Selectors */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-xs mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8A847C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. PT-89412) or Recipient Phone..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF9F6] border border-[#DDD8D0] rounded-xl text-[#222] focus:outline-none focus:ring-1 focus:ring-[#23382B] focus:border-[#23382B]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all cursor-pointer shrink-0"
            >
              Track Order
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-red-600 mt-2">{searchError}</p>
          )}

          {/* Quick Select demo orders */}
          <div className="mt-4 pt-4 border-t border-[#F0ECE4] flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#7A746E]">Quick Test Orders:</span>
            {orders.map((o) => {
              const isSelected = activeOrder?.id === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onSelectOrder(o.id)}
                  className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#23382B] bg-[#EBF1ED] text-[#23382B] font-semibold'
                      : 'border-[#E2DDD5] bg-[#FAF9F6] text-[#555] hover:bg-[#F2EFE9]'
                  }`}
                >
                  <span className="font-mono">{o.id}</span>
                  <span className="text-[11px] text-[#7A746E] capitalize">({o.status.replace(/_/g, ' ')})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Order Tracking Dashboard */}
        {activeOrder && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 Cols: Milestone Timeline & Status */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-xs space-y-8">
              
              {/* Order Meta Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EFECE6] pb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-2xl text-[#1F1E1D] font-medium">
                      Order {activeOrder.id}
                    </h3>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium capitalize ${getStatusColor(activeOrder.status)}`}>
                      {activeOrder.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A746E] mt-1">
                    Scheduled for {activeOrder.delivery.date} · Window: {activeOrder.delivery.timeSlot} (09:00 - 21:00)
                  </p>
                </div>

                {/* Florist Interactive Simulation Control */}
                <button
                  onClick={() => onAdvanceOrderStatus(activeOrder.id)}
                  className="px-3.5 py-2 text-xs font-semibold text-[#23382B] bg-[#EBF1ED] hover:bg-[#DEE7E0] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Simulate status advance for live demonstration"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C47053]" />
                  <span>Simulate Next Step</span>
                </button>
              </div>

              {/* 5-Step Timeline */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E5E0D8] space-y-8 my-4 ml-3">
                {activeOrder.trackingSteps.map((step, idx) => {
                  const isDone = step.completed;
                  const isCurrent = step.current;

                  return (
                    <div key={idx} className="relative group">
                      {/* Step Circle Marker */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#23382B] text-white shadow-xs'
                            : isCurrent
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-white border-2 border-[#DDD8D0] text-[#999]'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-semibold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <div className="flex items-baseline justify-between gap-2">
                          <h4
                            className={`text-sm font-semibold ${
                              isDone || isCurrent ? 'text-[#1F1E1D]' : 'text-[#888]'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <span className="font-mono text-xs text-[#8A847C] shrink-0">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#635D56] mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Items Preview */}
              <div className="pt-6 border-t border-[#EFECE6] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1F1E1D]">
                  Arrangements in this delivery
                </span>
                <div className="space-y-3">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 p-3 bg-[#FAF9F6] rounded-xl border border-[#EFECE6]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover bg-white shrink-0 border border-[#E8E2D8]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-medium text-[#1F1E1D] truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-[#7A746E]">
                          {item.size} Tier · {item.vase ? item.vase.name : 'Eco Paper Wrap'} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-display text-sm font-semibold text-[#23382B] tabular-nums">
                        ${(item.calculatedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handwritten Card Proof if present */}
              {activeOrder.delivery.includeCard && (
                <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7A746E]">
                    <span className="font-semibold text-[#1F1E1D]">Enclosed Calligraphy Card</span>
                    <span>{activeOrder.delivery.cardOccasion}</span>
                  </div>
                  <p className="font-display italic text-[#333] text-sm leading-relaxed bg-white p-3 rounded-lg border border-[#E2DDD5]">
                    "{activeOrder.delivery.cardMessage}"
                  </p>
                  <p className="text-right text-xs text-[#6B655E]">
                    — {activeOrder.delivery.isAnonymous ? 'An Anonymous Admirer' : activeOrder.delivery.cardSender || 'Sender'}
                  </p>
                </div>
              )}

            </div>

            {/* Right 5 Cols: Live Courier GPS & Interactive Route Simulation */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Courier Vehicle Status Card */}
              {activeOrder.courier && (
                <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-[#EFECE6] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#23382B] text-white flex items-center justify-center font-display text-lg font-semibold">
                        {activeOrder.courier.name.slice(0, 1)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#1F1E1D]">{activeOrder.courier.name}</h4>
                        <p className="text-xs text-[#7A746E]">{activeOrder.courier.vehicle}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${activeOrder.courier.phone}`}
                      className="p-2.5 rounded-full bg-[#FAF9F6] border border-[#DDD8D0] text-[#23382B] hover:bg-[#EBF1ED] transition-colors"
                      title="Contact Courier"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Telemetry data */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#F0F5F2] rounded-xl border border-[#CCE0D3]">
                      <div className="flex items-center gap-1.5 text-xs text-[#23382B] font-semibold">
                        <Thermometer className="w-3.5 h-3.5 text-[#23382B]" />
                        <span>Van Climate</span>
                      </div>
                      <p className="font-mono text-xs font-semibold text-[#1F1E1D] mt-1">
                        {activeOrder.courier.temperature}
                      </p>
                    </div>

                    <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8]">
                      <div className="flex items-center gap-1.5 text-xs text-[#C47053] font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Estimated Arrival</span>
                      </div>
                      <p className="font-mono text-xs font-semibold text-[#1F1E1D] mt-1">
                        {activeOrder.status === 'delivered' ? 'Delivered' : `In ~${activeOrder.courier.etaMinutes} minutes`}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Map Visual Mock */}
                  <div className="relative rounded-xl overflow-hidden border border-[#E2DDD5] bg-[#EFECE6] h-48 flex items-center justify-center">
                    {/* Simulated Map Streets Background */}
                    <div className="absolute inset-0 bg-[#E8E4DA] opacity-80 bg-[radial-gradient(#c7c0b2_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* SVG Route Line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 60,140 Q 140,80 200,100 T 320,60"
                        fill="none"
                        stroke="#23382B"
                        strokeWidth="3"
                        strokeDasharray="6 4"
                      />
                    </svg>

                    {/* Atelier Origin Pin */}
                    <div className="absolute left-10 bottom-8 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-[#23382B] text-white flex items-center justify-center text-[10px] shadow-md font-semibold">
                        A
                      </div>
                      <span className="text-[10px] font-semibold text-[#23382B] bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">
                        Atelier
                      </span>
                    </div>

                    {/* Destination Pin */}
                    <div className="absolute right-12 top-8 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#C47053] text-white flex items-center justify-center text-xs shadow-md animate-bounce">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-semibold text-[#1F1E1D] bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1 truncate max-w-[100px]">
                        {activeOrder.delivery.recipientName}
                      </span>
                    </div>

                    {/* Animated Courier Marker */}
                    {activeOrder.status !== 'delivered' ? (
                      <div className="absolute left-[52%] top-[44%] -translate-x-1/2 -translate-y-1/2 p-2 bg-[#23382B] text-white rounded-full shadow-lg ring-4 ring-white flex items-center justify-center">
                        <Truck className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="absolute right-12 top-8 p-1.5 bg-emerald-600 text-white rounded-full shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-[#555] shadow-xs flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[#23382B]" />
                      <span>{activeOrder.courier.currentLocationName}</span>
                    </div>
                  </div>

                  {/* Real-Time Courier Note dispatch */}
                  <form onSubmit={handleSendCourierNote} className="space-y-2 pt-2">
                    <label className="block text-xs font-semibold text-[#1F1E1D] flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-[#23382B]" />
                      <span>Send Quick Note to Courier Driver</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Leave with doorman James, thank you!"
                        value={courierNote}
                        onChange={(e) => setCourierNote(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#DDD8D0] rounded-xl text-[#333] focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-[#23382B] text-white rounded-xl hover:bg-[#1A2C21] transition-colors cursor-pointer"
                        title="Send note"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {noteSent && (
                      <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Driver notified via onboard terminal!</span>
                      </p>
                    )}
                  </form>
                </div>
              )}

              {/* Delivery Address & Instructions Summary */}
              <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-xs space-y-4 text-xs">
                <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[#1F1E1D]">
                  <MapPin className="w-4 h-4 text-[#23382B]" />
                  <span>Destination Contact</span>
                </div>

                <div className="space-y-1 text-[#555]">
                  <p className="font-semibold text-sm text-[#1F1E1D]">{activeOrder.delivery.recipientName}</p>
                  <p>{activeOrder.delivery.address}</p>
                  {activeOrder.delivery.aptSuite && <p>{activeOrder.delivery.aptSuite}</p>}
                  <p>{activeOrder.delivery.city}, {activeOrder.delivery.postalCode}</p>
                  <p className="font-mono text-[#1F1E1D] pt-1">{activeOrder.delivery.recipientPhone}</p>
                </div>

                {activeOrder.delivery.deliveryInstructions && (
                  <div className="pt-3 border-t border-[#EFECE6]">
                    <span className="font-semibold text-[#1F1E1D] block mb-1">Driver Instructions:</span>
                    <p className="text-[#6B655E] italic">"{activeOrder.delivery.deliveryInstructions}"</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
