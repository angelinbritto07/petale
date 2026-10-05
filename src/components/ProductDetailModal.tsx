import React, { useState } from 'react';
import { X, Check, Star, Sparkles, Droplets, Clock, Heart, ShoppingBag, ShieldCheck } from 'lucide-react';
import { FlowerProduct, BouquetSize, VaseOption, CartItem } from '../types';
import { VASE_OPTIONS } from '../data/flowerData';

interface ProductDetailModalProps {
  product: FlowerProduct | null;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onBuyNow: (item: Omit<CartItem, 'id'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<BouquetSize>('Standard');
  const [selectedVase, setSelectedVase] = useState<VaseOption>(VASE_OPTIONS[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'stems' | 'care'>('overview');

  const sizeMultiplierMap: Record<BouquetSize, number> = {
    Standard: 1.0,
    Deluxe: 1.35,
    Grandeur: 1.75,
  };

  const currentMultiplier = sizeMultiplierMap[selectedSize];
  const stemBaseTotal = product.stemBreakdown.reduce((sum, item) => sum + item.count, 0);
  const adjustedStemTotal = Math.round(stemBaseTotal * currentMultiplier);

  const productPrice = Math.round(product.basePrice * currentMultiplier);
  const singleUnitPrice = productPrice + selectedVase.price;
  const totalPrice = singleUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart({
      product,
      size: selectedSize,
      sizeMultiplier: currentMultiplier,
      vase: selectedVase.id === 'none' ? null : selectedVase,
      quantity,
      calculatedPrice: singleUnitPrice,
    });
    onClose();
  };

  const handleImmediateCheckout = () => {
    onBuyNow({
      product,
      size: selectedSize,
      sizeMultiplier: currentMultiplier,
      vase: selectedVase.id === 'none' ? null : selectedVase,
      quantity,
      calculatedPrice: singleUnitPrice,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E5E0D8] max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-[#2B2723] hover:text-black shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Photography & Specs */}
        <div className="md:w-1/2 bg-[#F7F5F0] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EFECE6] overflow-y-auto">
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-[#E8E3DB] bg-[#EFECE6]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-xs font-medium text-[#23382B]">
                Approx. {adjustedStemTotal} Fresh Cut Stems
              </div>
            </div>

            {/* Quick Badges / Sensory Highlights */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-[#EFECE6]">
                <div className="flex items-center gap-1.5 text-[#23382B] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C47053]" />
                  <span>Scent Intensity</span>
                </div>
                <p className="text-[#6B655E] line-clamp-2 leading-relaxed">{product.scentProfile}</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#EFECE6]">
                <div className="flex items-center gap-1.5 text-[#23382B] font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#23382B]" />
                  <span>Vase Longevity</span>
                </div>
                <p className="text-[#6B655E]">{product.bloomDuration} with fresh water care</p>
              </div>
            </div>

            {/* Botanical Care Note */}
            <div className="p-3.5 bg-[#FAF9F6] rounded-lg border border-[#EAE6DF] text-xs text-[#5D5750] space-y-1.5">
              <div className="font-semibold text-[#1F1E1D] flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-[#516E5A]" />
                <span>Hydration Wrap Guarantee</span>
              </div>
              <p>
                Stems travel in an organic nutrient gel pouch that sustains hydration for up to 36 hours during transit.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-[#7A746E]">
            <span className="italic font-serif">{product.botanicName}</span>
            <span>Hand-arranged in NYC</span>
          </div>
        </div>

        {/* Right Column: Customizer & Purchase Module */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#7E7770]">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <div className="flex items-center gap-1 text-[#222]">
                  <Star className="w-3.5 h-3.5 fill-[#E6A15C] text-[#E6A15C]" />
                  <span className="font-semibold">{product.rating}</span>
                  <span>({product.reviewsCount} verified reviews)</span>
                </div>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl text-[#1F1E1D] font-medium mt-1">
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-[#23382B] tabular-nums">
                  ${productPrice}
                </span>
                {selectedVase.price > 0 && (
                  <span className="text-xs text-[#635D56] font-medium">
                    + ${selectedVase.price} ({selectedVase.name})
                  </span>
                )}
              </div>
            </div>

            {/* Customizer Tabs */}
            <div className="flex border-b border-[#EAE6DF] text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 px-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#23382B] text-[#1F1E1D] font-semibold'
                    : 'border-transparent text-[#7A746E] hover:text-[#222]'
                }`}
              >
                1. Size & Vase
              </button>
              <button
                onClick={() => setActiveTab('stems')}
                className={`pb-2 px-3 border-b-2 transition-colors ${
                  activeTab === 'stems'
                    ? 'border-[#23382B] text-[#1F1E1D] font-semibold'
                    : 'border-transparent text-[#7A746E] hover:text-[#222]'
                }`}
              >
                2. Fresh Stems ({adjustedStemTotal})
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 px-3 border-b-2 transition-colors ${
                  activeTab === 'care'
                    ? 'border-[#23382B] text-[#1F1E1D] font-semibold'
                    : 'border-transparent text-[#7A746E] hover:text-[#222]'
                }`}
              >
                3. Florist Care Guide
              </button>
            </div>

            {/* Tab 1: Size & Vase Selection */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Size Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-[#1F1E1D] uppercase tracking-wider">
                      Bouquet Density
                    </span>
                    <span className="text-[#7A746E]">Selected: {selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Standard', 'Deluxe', 'Grandeur'] as BouquetSize[]).map((size) => {
                      const mult = sizeMultiplierMap[size];
                      const price = Math.round(product.basePrice * mult);
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`p-3 text-left rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#23382B] bg-[#EBF1ED]/60 ring-1 ring-[#23382B]'
                              : 'border-[#E2DDD5] bg-white hover:border-[#C8C2B7]'
                          }`}
                        >
                          <div className="text-xs font-semibold text-[#1F1E1D] flex items-center justify-between">
                            <span>{size}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#23382B]" />}
                          </div>
                          <div className="text-xs text-[#6B655E] mt-1">
                            {size === 'Standard' && 'Original'}
                            {size === 'Deluxe' && '+35% Stems'}
                            {size === 'Grandeur' && '+75% Stems'}
                          </div>
                          <div className="font-display text-sm font-semibold text-[#23382B] mt-1 tabular-nums">
                            ${price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vase Pairing Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-[#1F1E1D] uppercase tracking-wider">
                      Vessel & Presentation
                    </span>
                    <span className="text-[#7A746E]">
                      {selectedVase.price === 0 ? 'Eco Paper Wrap' : `+$${selectedVase.price}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {VASE_OPTIONS.map((vase) => {
                      const isSelected = selectedVase.id === vase.id;
                      return (
                        <button
                          key={vase.id}
                          onClick={() => setSelectedVase(vase)}
                          className={`w-full p-2.5 text-left rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-[#23382B] bg-[#FAF8F5] ring-1 ring-[#23382B]'
                              : 'border-[#EAE6DF] bg-white hover:border-[#D6D0C5]'
                          }`}
                        >
                          <div className="pr-2">
                            <p className="text-xs font-semibold text-[#1F1E1D]">{vase.name}</p>
                            <p className="text-[11px] text-[#78716A] line-clamp-1">{vase.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-semibold text-[#23382B] tabular-nums">
                              {vase.price === 0 ? 'Included' : `+$${vase.price}`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity adjustment */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-semibold text-[#1F1E1D] uppercase tracking-wider">
                    Quantity
                  </span>
                  <div className="flex items-center border border-[#DDD8D0] rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-sm hover:bg-[#F2EFE9] text-[#444] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold text-[#222] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-sm hover:bg-[#F2EFE9] text-[#444] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Stem breakdown */}
            {activeTab === 'stems' && (
              <div className="space-y-3">
                <p className="text-xs text-[#6B655E]">
                  Every arrangement is hand-tied with fresh blooms. Here is the exact botanical recipe for the{' '}
                  <strong className="text-[#1F1E1D]">{selectedSize}</strong> tier:
                </p>
                <div className="space-y-2 bg-[#FAF9F6] p-4 rounded-xl border border-[#EFECE6]">
                  {product.stemBreakdown.map((item, idx) => {
                    const scaledCount = Math.round(item.count * currentMultiplier);
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#EAE6DF] last:border-b-0">
                        <span className="text-[#2F2C29]">{item.name}</span>
                        <span className="font-semibold text-[#23382B] tabular-nums">{scaledCount} stems</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[11px] text-[#78716A] italic">
                  * Stems are freshly snipped and conditioned with floral food prior to dispatch.
                </div>
              </div>
            )}

            {/* Tab 3: Care Guide */}
            {activeTab === 'care' && (
              <div className="space-y-3">
                <p className="text-xs text-[#6B655E]">
                  Follow these master florist recommendations to maximize vase life and petal fragrance:
                </p>
                <ul className="space-y-2 text-xs text-[#3A3632]">
                  {product.careInstructions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-[#FAF9F6] p-3 rounded-lg border border-[#EFECE6]">
                      <Check className="w-4 h-4 text-[#23382B] shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Action Footer */}
          <div className="pt-6 mt-6 border-t border-[#EAE6DF] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6B655E]">
              <span>Delivery includes free custom greeting card</span>
              <span className="font-semibold text-[#1F1E1D] text-sm tabular-nums">
                Total: ${totalPrice}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAdd}
                className="w-full py-3 bg-[#FAF9F6] border border-[#23382B] text-[#23382B] text-xs font-semibold rounded-xl hover:bg-[#EBF1ED] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleImmediateCheckout}
                className="w-full py-3 bg-[#23382B] text-white text-xs font-semibold rounded-xl hover:bg-[#1A2C21] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Schedule & Checkout</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
