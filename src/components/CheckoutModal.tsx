import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Printer,
  Sparkles,
  Smartphone,
  Eye,
  KeyRound,
} from 'lucide-react';
import { CartItem, DeliveryDetails, PaymentDetails, Order, TrackingStep } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCreated: (order: Order) => void;
  onGoToTracking: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCreated,
  onGoToTracking,
}) => {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState<'delivery' | 'payment' | 'otp' | 'success'>('delivery');
  
  // Delivery scheduling state
  const today = new Date();
  const dateOptions = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = d.getDate();
    return {
      dateStr,
      weekday,
      month,
      dayNum,
      isToday: i === 0,
      isTomorrow: i === 1,
    };
  });

  const [delivery, setDelivery] = useState<DeliveryDetails>({
    date: dateOptions[0].dateStr,
    timeSlot: 'afternoon',
    recipientName: '',
    recipientPhone: '',
    address: '',
    aptSuite: '',
    city: 'New York',
    postalCode: '',
    deliveryInstructions: '',
    includeCard: true,
    cardOccasion: 'Love & Romance',
    cardMessage: 'Wishing you a day filled with natural beauty and endless sunshine!',
    cardSender: '',
    isAnonymous: false,
  });

  const [deliveryErrors, setDeliveryErrors] = useState<Record<string, string>>({});

  // Payment State
  const [payment, setPayment] = useState<PaymentDetails>({
    method: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: '',
    billingSameAsDelivery: true,
  });

  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Price calculations
  const subtotal = items.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const deliveryFee = subtotal >= 85 ? 0 : 12;
  const tax = +(subtotal * 0.08875).toFixed(2);
  const total = +(subtotal + deliveryFee + tax).toFixed(2);

  // Validation
  const validateDelivery = (): boolean => {
    const errs: Record<string, string> = {};
    if (!delivery.recipientName.trim()) errs.recipientName = 'Recipient name is required';
    if (!delivery.recipientPhone.trim()) errs.recipientPhone = 'Phone number is required for courier updates';
    if (!delivery.address.trim()) errs.address = 'Delivery address is required';
    if (!delivery.postalCode.trim()) errs.postalCode = 'Zip code is required';
    if (delivery.includeCard && !delivery.cardMessage.trim()) errs.cardMessage = 'Please add a message or uncheck the card';

    setDeliveryErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = (): boolean => {
    if (payment.method !== 'card') return true;
    const errs: Record<string, string> = {};
    const cleanNum = payment.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) errs.cardNumber = 'Valid 15-16 digit card number required';
    if (!payment.cardExpiry.includes('/') || payment.cardExpiry.length < 5) errs.cardExpiry = 'MM/YY required';
    if (payment.cardCvc.length < 3) errs.cardCvc = '3-4 digits required';
    if (!payment.cardName.trim()) errs.cardName = 'Name on card is required';

    setPaymentErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDelivery()) {
      setCurrentStep('payment');
    }
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePayment()) return;

    if (payment.method === 'card') {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        setCurrentStep('otp'); // Trigger 3D Secure Verification
      }, 700);
    } else {
      finalizeOrder(payment.method === 'cod' ? 'Cash on Delivery' : payment.method.toUpperCase());
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setOtpError('Please enter the 6-digit SMS verification code (try 789412)');
      return;
    }
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const cleanNum = payment.cardNumber.replace(/\s+/g, '');
      const last4 = cleanNum.slice(-4) || '4242';
      finalizeOrder(`Visa ending in ${last4}`);
    }, 800);
  };

  const finalizeOrder = (methodName: string) => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `PT-${randomNum}`;
    const nowIso = new Date().toISOString();

    const trackingSteps: TrackingStep[] = [
      {
        status: 'confirmed',
        label: 'Order Confirmed & Paid',
        timestamp: 'Just now',
        description: 'Payment authorized securely. Delivery window reserved.',
        completed: true,
        current: false,
      },
      {
        status: 'arranging',
        label: 'Master Florist Crafting',
        timestamp: 'Estimated shortly',
        description: 'Blossoms hand-selected from morning harvest, conditioned, and spiral-stem arranged.',
        completed: false,
        current: true,
      },
      {
        status: 'inspected',
        label: 'Quality & Cold Hydration Check',
        timestamp: 'Pending',
        description: 'Inspection approved and wrapped in nutrient hydration gel pouch.',
        completed: false,
        current: false,
      },
      {
        status: 'out_for_delivery',
        label: 'Out for Delivery (Eco Sprinter)',
        timestamp: `Scheduled for ${delivery.date} (${delivery.timeSlot})`,
        description: 'Dispatched with climate-controlled courier team.',
        completed: false,
        current: false,
      },
      {
        status: 'delivered',
        label: 'Hand-Delivered to Recipient',
        timestamp: 'Pending Handover',
        description: 'Personally handed over with doorstep photo verification.',
        completed: false,
        current: false,
      },
    ];

    const orderObj: Order = {
      id: newOrderId,
      createdAt: nowIso,
      items: [...items],
      delivery: { ...delivery },
      payment: {
        method: methodName,
        last4: methodName.includes('ending in') ? methodName.slice(-4) : undefined,
        amount: total,
        transactionId: `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
      },
      pricing: {
        subtotal,
        vaseTotal: 0,
        deliveryFee,
        tax,
        discount: 0,
        total,
      },
      status: 'arranging',
      trackingSteps,
      courier: {
        name: 'Julian Vance',
        phone: '+1 (555) 349-2189',
        vehicle: 'Eco Electric Sprinter #18',
        currentLocationName: 'Pétale & Tige Atelier Center',
        temperature: '14.0°C (Optimal Bloom Hydration)',
        etaMinutes: 45,
      },
    };

    setCreatedOrder(orderObj);
    onOrderCreated(orderObj);
    setCurrentStep('success');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#E5E0D8] max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-[#EFECE6] bg-[#FAF9F6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-medium text-[#1F1E1D]">Pétale & Tige</span>
            <span className="text-[#888]">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B655E]">
              {currentStep === 'delivery' && 'Step 1 of 2: Delivery & Card Scheduling'}
              {currentStep === 'payment' && 'Step 2 of 2: Secure Payment Gateway'}
              {currentStep === 'otp' && 'Bank 3D-Secure Verification'}
              {currentStep === 'success' && 'Order Confirmed & Receipt'}
            </span>
          </div>

          {currentStep !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6E6862] hover:text-[#1F1E1D] hover:bg-[#EFECE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: DELIVERY SCHEDULING */}
          {currentStep === 'delivery' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Delivery Date Picker */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#23382B]" />
                    <span>Choose Delivery Date</span>
                  </label>
                  <span className="text-xs text-[#7A746E]">Same-day cutoff: 4:00 PM</span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {dateOptions.map((opt) => {
                    const isSelected = delivery.date === opt.dateStr;
                    return (
                      <button
                        type="button"
                        key={opt.dateStr}
                        onClick={() => setDelivery({ ...delivery, date: opt.dateStr })}
                        className={`flex flex-col items-center justify-center min-w-[76px] py-2.5 px-2 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#23382B] bg-[#23382B] text-white shadow-sm'
                            : 'border-[#E2DDD5] bg-white text-[#444] hover:border-[#B5AEA2]'
                        }`}
                      >
                        <span className={`text-[11px] font-medium uppercase ${isSelected ? 'text-[#D0E2D6]' : 'text-[#8A847C]'}`}>
                          {opt.weekday}
                        </span>
                        <span className="text-base font-semibold tabular-nums mt-0.5">
                          {opt.dayNum}
                        </span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#FAF9F6]' : 'text-[#777]'}`}>
                          {opt.isToday ? 'Today' : opt.isTomorrow ? 'Tmrw' : opt.month}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Time Window Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#23382B]" />
                  <span>Select Delivery Time Window</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { slot: 'morning', label: 'Morning', hours: '09:00 - 12:00', desc: 'Surprise desk & early wake-up' },
                    { slot: 'afternoon', label: 'Afternoon', hours: '13:00 - 17:00', desc: 'Standard residential peak' },
                    { slot: 'evening', label: 'Evening', hours: '18:00 - 21:00', desc: 'Dinner homecoming delivery' },
                  ].map((item) => {
                    const isSelected = delivery.timeSlot === item.slot;
                    return (
                      <button
                        type="button"
                        key={item.slot}
                        onClick={() => setDelivery({ ...delivery, timeSlot: item.slot as any })}
                        className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#23382B] bg-[#FAF8F5] ring-1 ring-[#23382B]'
                            : 'border-[#E2DDD5] bg-white hover:border-[#C8C2B7]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-[#1F1E1D]">
                          <span>{item.label}</span>
                          <span className="text-[#23382B] font-mono text-[11px]">{item.hours}</span>
                        </div>
                        <p className="text-[11px] text-[#7A746E] mt-1">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="pt-4 border-t border-[#EFECE6] space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1F1E1D]">
                  <MapPin className="w-4 h-4 text-[#23382B]" />
                  <span>Recipient & Delivery Address</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={delivery.recipientName}
                      onChange={(e) => setDelivery({ ...delivery, recipientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                    {deliveryErrors.recipientName && (
                      <p className="text-[11px] text-red-600 mt-1">{deliveryErrors.recipientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Recipient Phone (For Courier GPS Updates) *
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +1 (555) 392-8419"
                      value={delivery.recipientPhone}
                      onChange={(e) => setDelivery({ ...delivery, recipientPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                    {deliveryErrors.recipientPhone && (
                      <p className="text-[11px] text-red-600 mt-1">{deliveryErrors.recipientPhone}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={delivery.address}
                      onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                    {deliveryErrors.address && (
                      <p className="text-[11px] text-red-600 mt-1">{deliveryErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Apartment / Suite / Unit (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apt 4B, Floor 3"
                      value={delivery.aptSuite}
                      onChange={(e) => setDelivery({ ...delivery, aptSuite: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Postal Code / Zip *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10024"
                      value={delivery.postalCode}
                      onChange={(e) => setDelivery({ ...delivery, postalCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                    {deliveryErrors.postalCode && (
                      <p className="text-[11px] text-red-600 mt-1">{deliveryErrors.postalCode}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Driver Instructions (Concierge, Gate Code, Leave Safe Place)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Doorman building. Leave with front desk if recipient not in."
                      value={delivery.deliveryInstructions}
                      onChange={(e) => setDelivery({ ...delivery, deliveryInstructions: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                  </div>
                </div>
              </div>

              {/* Complimentary Handwritten Greeting Card */}
              <div className="pt-4 border-t border-[#EFECE6] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1F1E1D] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={delivery.includeCard}
                      onChange={(e) => setDelivery({ ...delivery, includeCard: e.target.checked })}
                      className="rounded text-[#23382B] focus:ring-[#23382B]"
                    />
                    <FileText className="w-4 h-4 text-[#C47053]" />
                    <span>Include Complimentary Handwritten Artisan Greeting Card</span>
                  </label>
                  <span className="text-[11px] text-[#23382B] font-semibold bg-[#EBF1ED] px-2 py-0.5 rounded">
                    Free ($0.00)
                  </span>
                </div>

                {delivery.includeCard && (
                  <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E8E2D8] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#6B655E] mb-1">
                          Occasion Heading
                        </label>
                        <select
                          value={delivery.cardOccasion}
                          onChange={(e) => setDelivery({ ...delivery, cardOccasion: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg text-[#333]"
                        >
                          <option value="Love & Romance">Love & Romance</option>
                          <option value="Happy Birthday">Happy Birthday</option>
                          <option value="Anniversary">Anniversary</option>
                          <option value="Congratulations">Congratulations</option>
                          <option value="Thinking of You">Thinking of You</option>
                          <option value="Sympathy & Comfort">Sympathy & Comfort</option>
                          <option value="Just Because">Just Because</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#6B655E] mb-1">
                          Signature / From
                        </label>
                        <input
                          type="text"
                          placeholder={delivery.isAnonymous ? 'Sending Anonymously' : 'Your Name / Nickname'}
                          disabled={delivery.isAnonymous}
                          value={delivery.cardSender}
                          onChange={(e) => setDelivery({ ...delivery, cardSender: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg disabled:bg-[#ECE8E1]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-medium text-[#6B655E]">
                          Message for Hand-Calligraphy
                        </label>
                        <span className="text-[10px] text-[#888]">
                          {delivery.cardMessage.length} / 250 characters
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={250}
                        placeholder="Write your personal heartfelt message..."
                        value={delivery.cardMessage}
                        onChange={(e) => setDelivery({ ...delivery, cardMessage: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                      />
                      {deliveryErrors.cardMessage && (
                        <p className="text-[11px] text-red-600 mt-0.5">{deliveryErrors.cardMessage}</p>
                      )}
                    </div>

                    {/* Anonymous toggle */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 text-xs text-[#555] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={delivery.isAnonymous}
                          onChange={(e) => setDelivery({ ...delivery, isAnonymous: e.target.checked })}
                          className="rounded text-[#23382B]"
                        />
                        <span>Send as an Anonymous Surprise (Do not disclose my name to recipient)</span>
                      </label>
                    </div>

                    {/* Live Card Envelope Preview */}
                    <div className="p-3 bg-white rounded-lg border border-[#E2DDD5] shadow-xs">
                      <div className="flex items-center justify-between text-[10px] text-[#9A948C] uppercase tracking-wider mb-2">
                        <span>Physical Card Proof Preview</span>
                        <span>Sealed with botanical wax</span>
                      </div>
                      <p className="font-display italic text-[#3A3631] text-base leading-relaxed text-center py-2 px-4">
                        "{delivery.cardMessage || 'Your message will appear here in fine calligraphed script.'}"
                      </p>
                      <p className="text-right text-xs font-display font-medium text-[#516E5A] pr-4">
                        — {delivery.isAnonymous ? 'An admirer' : delivery.cardSender || 'Your sender'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-[#EFECE6] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[#666] hover:text-[#222]"
                >
                  Return to Bag
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Continue to Secure Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: SECURE PAYMENT GATEWAY */}
          {currentStep === 'payment' && (
            <form onSubmit={handleStartPayment} className="space-y-6">
              
              {/* Security Header Banner */}
              <div className="bg-[#F0F5F2] border border-[#CDE0D4] p-3.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#23382B] text-white flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-[#1F1E1D]">Bank-Grade 256-Bit SSL Encrypted Gateway</h4>
                    <p className="text-[11px] text-[#55695B]">PCI-DSS Level 1 Compliant · 100% Bloom Quality Guarantee</p>
                  </div>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#23382B] shrink-0" />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1F1E1D] mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'card', name: 'Credit Card', icon: CreditCard },
                    { id: 'applepay', name: 'Apple Pay', icon: Smartphone },
                    { id: 'googlepay', name: 'Google Pay', icon: Sparkles },
                    { id: 'cod', name: 'Pay on Delivery', icon: MapPin },
                  ].map((method) => {
                    const isSelected = payment.method === method.id;
                    const Icon = method.icon;
                    return (
                      <button
                        type="button"
                        key={method.id}
                        onClick={() => setPayment({ ...payment, method: method.id as any })}
                        className={`p-3 text-center rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-[#23382B] bg-[#FAF8F5] ring-1 ring-[#23382B] text-[#23382B]'
                            : 'border-[#E2DDD5] bg-white text-[#555] hover:border-[#C8C2B7]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{method.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Credit Card Inputs */}
              {payment.method === 'card' && (
                <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Card Number *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 8912 3456 7890"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                      />
                      <CreditCard className="w-4 h-4 text-[#888] absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                    {paymentErrors.cardNumber && (
                      <p className="text-[11px] text-red-600 mt-1">{paymentErrors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={payment.cardExpiry}
                        onChange={(e) => setPayment({ ...payment, cardExpiry: formatExpiry(e.target.value) })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                      />
                      {paymentErrors.cardExpiry && (
                        <p className="text-[11px] text-red-600 mt-1">{paymentErrors.cardExpiry}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#444] mb-1">
                        Security Code (CVV) *
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="3 or 4 digits"
                        value={payment.cardCvc}
                        onChange={(e) => setPayment({ ...payment, cardCvc: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                      />
                      {paymentErrors.cardCvc && (
                        <p className="text-[11px] text-red-600 mt-1">{paymentErrors.cardCvc}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#444] mb-1">
                      Cardholder Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Julian Vance"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#23382B]"
                    />
                    {paymentErrors.cardName && (
                      <p className="text-[11px] text-red-600 mt-1">{paymentErrors.cardName}</p>
                    )}
                  </div>
                </div>
              )}

              {payment.method === 'applepay' && (
                <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <Smartphone className="w-8 h-8 text-[#1F1E1D] mx-auto" />
                  <p className="text-xs font-semibold text-[#1F1E1D]">Apple Pay Ready</p>
                  <p className="text-xs text-[#6B655E]">
                    Your default Apple Wallet card will be charged upon biometric confirmation.
                  </p>
                </div>
              )}

              {payment.method === 'googlepay' && (
                <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-[#23382B] mx-auto" />
                  <p className="text-xs font-semibold text-[#1F1E1D]">Google Pay Ready</p>
                  <p className="text-xs text-[#6B655E]">
                    Instant authorization with your connected Google account card.
                  </p>
                </div>
              )}

              {payment.method === 'cod' && (
                <div className="p-6 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-center space-y-2">
                  <MapPin className="w-8 h-8 text-[#C47053] mx-auto" />
                  <p className="text-xs font-semibold text-[#1F1E1D]">Pay on Courier Delivery</p>
                  <p className="text-xs text-[#6B655E]">
                    Pay cash or card terminal directly to our climate-controlled courier upon stem inspection.
                  </p>
                </div>
              )}

              {/* Order breakdown summary */}
              <div className="p-4 bg-[#F7F5F0] rounded-xl border border-[#E8E2D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#6B655E]">
                  <span>Items Subtotal ({items.length} arrangements)</span>
                  <span className="font-semibold text-[#1F1E1D] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B655E]">
                  <span>Courier Delivery ({delivery.date} · {delivery.timeSlot})</span>
                  <span className="text-[#23382B] font-medium">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B655E]">
                  <span>Estimated State & Local Tax</span>
                  <span className="font-semibold text-[#1F1E1D] tabular-nums">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#DFD9CE] flex justify-between items-baseline font-bold text-sm text-[#1F1E1D]">
                  <span>Authorized Charge</span>
                  <span className="font-display text-xl text-[#23382B] tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('delivery')}
                  className="px-4 py-2 text-xs font-medium text-[#666] hover:text-[#222] flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Delivery</span>
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-6 py-3 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Securing Connection...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize ${total.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP: 3D SECURE OTP SIMULATION */}
          {currentStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="max-w-md mx-auto py-4 space-y-6 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF1ED] text-[#23382B] flex items-center justify-center mx-auto">
                <KeyRound className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-display text-xl text-[#1F1E1D] font-medium">3D-Secure Bank Verification</h3>
                <p className="text-xs text-[#6B655E] mt-1">
                  A 6-digit confirmation code was dispatched to your mobile ending in{' '}
                  <strong className="text-[#1F1E1D]">•••• {delivery.recipientPhone.slice(-4) || '8419'}</strong> to protect this transaction.
                </p>
              </div>

              <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-3">
                <label className="block text-xs font-semibold text-[#1F1E1D]">Enter 6-Digit SMS Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ''));
                    setOtpError('');
                  }}
                  placeholder="000000"
                  className="w-48 mx-auto text-center tracking-[0.5em] font-mono text-xl py-2.5 bg-white border border-[#DDD8D0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#23382B]"
                />
                {otpError && <p className="text-xs text-red-600">{otpError}</p>}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpCode('789412');
                      setOtpError('');
                    }}
                    className="text-xs text-[#23382B] underline hover:text-[#18271E]"
                  >
                    Quick-Fill Test Code: 789412
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep('payment')}
                  className="px-4 py-2 text-xs text-[#6B655E] hover:text-[#222]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-6 py-2.5 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#1A2C21] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Verifying...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: ORDER CONFIRMED & RECEIPT */}
          {currentStep === 'success' && createdOrder && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2 py-4">
                <CheckCircle2 className="w-12 h-12 text-[#23382B] mx-auto" />
                <h3 className="font-display text-2xl sm:text-3xl text-[#1F1E1D] font-normal">
                  Order Successfully Placed
                </h3>
                <p className="text-xs text-[#6B655E]">
                  Your floral arrangement has been assigned to our master florists. An SMS and email receipt has been dispatched.
                </p>
                <div className="inline-block px-4 py-1.5 bg-[#EBF1ED] text-[#23382B] rounded-lg text-xs font-mono font-semibold tracking-wider">
                  Order ID: {createdOrder.id}
                </div>
              </div>

              {/* Official Receipt Card */}
              <div className="p-6 bg-[#FAF9F6] rounded-2xl border border-[#E5E0D8] space-y-5 text-xs text-[#444]">
                <div className="flex justify-between items-start border-b border-[#EAE6DF] pb-4">
                  <div>
                    <p className="font-display text-base font-semibold text-[#1F1E1D]">Pétale & Tige Floral Atelier</p>
                    <p className="text-[11px] text-[#7A746E]">Artisanal Botanical Studio · New York</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[#1F1E1D] font-medium">{createdOrder.id}</p>
                    <p className="text-[11px] text-[#7A746E]">{new Date(createdOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items itemized */}
                <div className="space-y-2.5 border-b border-[#EAE6DF] pb-4">
                  <div className="font-semibold text-[#1F1E1D] uppercase tracking-wider text-[11px]">
                    Arrangements
                  </div>
                  {createdOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-[#1F1E1D]">{item.product.name}</span>
                        <span className="text-[#7A746E] text-[11px] ml-1.5">
                          ({item.size}{item.vase ? ` · ${item.vase.name}` : ''}) x{item.quantity}
                        </span>
                      </div>
                      <span className="font-mono font-medium text-[#1F1E1D]">
                        ${(item.calculatedPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery breakdown */}
                <div className="grid grid-cols-2 gap-4 border-b border-[#EAE6DF] pb-4">
                  <div>
                    <span className="font-semibold text-[#1F1E1D] uppercase tracking-wider text-[11px] block mb-1">
                      Recipient & Destination
                    </span>
                    <p className="font-medium text-[#1F1E1D]">{createdOrder.delivery.recipientName}</p>
                    <p className="text-[#6B655E]">{createdOrder.delivery.address}</p>
                    {createdOrder.delivery.aptSuite && <p className="text-[#6B655E]">{createdOrder.delivery.aptSuite}</p>}
                    <p className="text-[#6B655E]">{createdOrder.delivery.city}, {createdOrder.delivery.postalCode}</p>
                    <p className="text-[11px] text-[#7A746E] mt-1">{createdOrder.delivery.recipientPhone}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-[#1F1E1D] uppercase tracking-wider text-[11px] block mb-1">
                      Scheduled Delivery
                    </span>
                    <p className="font-medium text-[#1F1E1D]">{createdOrder.delivery.date}</p>
                    <p className="text-[#6B655E] capitalize">{createdOrder.delivery.timeSlot} Window (09:00 - 21:00)</p>
                    <p className="text-[#23382B] text-[11px] font-medium mt-1">Climate-Controlled Eco Van</p>
                  </div>
                </div>

                {/* Greeting Card Note */}
                {createdOrder.delivery.includeCard && (
                  <div className="border-b border-[#EAE6DF] pb-4">
                    <span className="font-semibold text-[#1F1E1D] uppercase tracking-wider text-[11px] block mb-1">
                      Handwritten Calligraphy Card
                    </span>
                    <p className="font-display italic text-[#333] text-sm bg-white p-3 rounded-lg border border-[#E2DDD5]">
                      "{createdOrder.delivery.cardMessage}"
                    </p>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[#6B655E]">
                    <span>Subtotal</span>
                    <span className="font-mono">${createdOrder.pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B655E]">
                    <span>Delivery Fee</span>
                    <span className="font-mono">
                      {createdOrder.pricing.deliveryFee === 0 ? 'FREE' : `$${createdOrder.pricing.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#6B655E]">
                    <span>Sales Tax</span>
                    <span className="font-mono">${createdOrder.pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1F1E1D] pt-2 border-t border-[#EAE6DF]">
                    <span>Total Paid ({createdOrder.payment.method})</span>
                    <span className="font-display text-lg text-[#23382B] font-semibold tabular-nums">
                      ${createdOrder.pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-3 bg-white border border-[#DDD8D0] text-[#333] text-xs font-semibold rounded-xl hover:bg-[#F2EFE9] transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#666]" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onGoToTracking(createdOrder.id);
                    onClose();
                  }}
                  className="w-full flex-1 py-3.5 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Track Delivery in Real-Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
