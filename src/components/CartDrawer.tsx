import React from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 85;
  const subtotal = items.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-[#E5E0D8]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EFECE6] flex items-center justify-between bg-[#FAF9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#23382B]" />
              <h2 className="font-display text-xl text-[#1F1E1D] font-medium">Your Floral Bag</h2>
              <span className="text-xs text-[#7A746E]">
                ({items.reduce((acc, item) => acc + item.quantity, 0)} items)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#6E6862] hover:text-[#1F1E1D] hover:bg-[#EFECE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="px-6 py-3 bg-[#F4F7F5] border-b border-[#DEE7E1] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#36503E] font-medium mb-1.5 flex items-center justify-between">
                <span>Add <strong>${remainingForFreeShipping.toFixed(0)}</strong> more for free courier delivery</span>
                <span className="text-[11px] text-[#637E6B]">{progressPercent.toFixed(0)}%</span>
              </p>
            ) : (
              <p className="text-[#23382B] font-semibold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C47053]" />
                <span>You unlocked Free Climate-Controlled Delivery!</span>
              </p>
            )}
            <div className="w-full bg-[#D4E0D7] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#23382B] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-center text-[#8C857B] mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-display text-xl text-[#1F1E1D] font-medium mb-1">Your bag is empty</h3>
                <p className="text-xs text-[#78716A] max-w-xs mb-6">
                  Browse our seasonal blooms and choose a bouquet with our signature vase and delivery scheduling.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#23382B] text-white text-xs font-semibold rounded-lg hover:bg-[#1A2C21] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EFECE6] flex gap-4 items-start relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-white shrink-0 border border-[#E8E4DC]"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-display text-base text-[#1F1E1D] font-medium truncate">
                      {item.product.name}
                    </h4>

                    {/* Unboxed Metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-[#736C64] mt-0.5">
                      <span>{item.size}</span>
                      {item.vase && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.vase.name}</span>
                        </>
                      )}
                    </div>

                    <div className="font-display text-sm font-semibold text-[#23382B] mt-1 tabular-nums">
                      ${item.calculatedPrice} each
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-[#DDD8D0] rounded-md overflow-hidden bg-white text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-[#F2EFE9] text-[#555]"
                        >
                          -
                        </button>
                        <span className="px-2.5 font-semibold text-[#222] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-[#F2EFE9] text-[#555]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#9C948A] hover:text-[#C47053] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display text-base font-semibold text-[#1F1E1D] tabular-nums">
                      ${item.calculatedPrice * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#EFECE6] bg-[#FAF9F6] space-y-4">
              <div className="space-y-1.5 text-xs text-[#6B655E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1E1D] tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Courier Delivery</span>
                  <span className="text-[#23382B] font-medium">
                    {remainingForFreeShipping === 0 ? 'FREE' : '$12.00 (Select slot next)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handwritten Greeting Card</span>
                  <span className="text-[#23382B] font-medium">Complimentary</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE6DF] flex justify-between items-baseline">
                <span className="text-sm font-semibold text-[#1F1E1D]">Estimated Total</span>
                <span className="font-display text-2xl font-bold text-[#23382B] tabular-nums">
                  ${(subtotal + (remainingForFreeShipping === 0 ? 0 : 12)).toFixed(2)}
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-[#23382B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-[#1A2C21] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Delivery & Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A746E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#516E5A]" />
                <span>256-bit SSL encrypted · Guaranteed bloom freshness</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
