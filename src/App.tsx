import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerSection } from './components/OrderTrackerSection';
import { CustomerReviewsSection } from './components/CustomerReviewsSection';
import { DeliveryInfoSection } from './components/DeliveryInfoSection';
import { AtelierCraftSection } from './components/AtelierCraftSection';
import { Footer } from './components/Footer';

import { FlowerProduct, CartItem, Order, CustomerReview } from './types';
import { PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS } from './data/flowerData';

export default function App() {
  // Local storage state initialization
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('petale_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('petale_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('petale_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<FlowerProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [activeNavSection, setActiveNavSection] = useState<string>('catalog');
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(INITIAL_ORDERS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('petale_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error(err);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('petale_orders', JSON.stringify(orders));
    } catch (err) {
      console.error(err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('petale_reviews', JSON.stringify(reviews));
    } catch (err) {
      console.error(err);
    }
  }, [reviews]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.size === newItem.size &&
          item.vase?.id === newItem.vase?.id
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      } else {
        const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        return [...prev, { ...newItem, id }];
      }
    });

    showToast(`Added ${newItem.product.name} (${newItem.size}) to your bag`);
    setIsCartOpen(true);
  };

  const handleBuyNow = (newItem: Omit<CartItem, 'id'>) => {
    handleAddToCart(newItem);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order created callback
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // clear cart
    setSelectedTrackingOrderId(newOrder.id);
  };

  // Advance order status for testing & demo
  const handleAdvanceOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const statusSequence: Order['status'][] = [
          'confirmed',
          'arranging',
          'inspected',
          'out_for_delivery',
          'delivered',
        ];
        const currentIdx = statusSequence.indexOf(order.status);
        const nextIdx = Math.min(statusSequence.length - 1, currentIdx + 1);
        const nextStatus = statusSequence[nextIdx];

        // Update steps
        const updatedSteps = order.trackingSteps.map((step, idx) => {
          if (idx < nextIdx) {
            return { ...step, completed: true, current: false };
          } else if (idx === nextIdx) {
            return {
              ...step,
              completed: nextStatus === 'delivered',
              current: nextStatus !== 'delivered',
              timestamp: 'Updated just now',
            };
          } else {
            return { ...step, completed: false, current: false };
          }
        });

        const updatedCourier = order.courier
          ? {
              ...order.courier,
              etaMinutes: nextStatus === 'delivered' ? 0 : Math.max(5, order.courier.etaMinutes - 15),
              currentLocationName:
                nextStatus === 'delivered'
                  ? 'Arrived at Recipient Address'
                  : 'Approaching Delivery Street',
            }
          : undefined;

        return {
          ...order,
          status: nextStatus,
          trackingSteps: updatedSteps,
          courier: updatedCourier,
        };
      })
    );

    showToast('Updated order milestone for live demonstration');
  };

  // Navigation smoothly scrolls to anchor
  const handleNavigate = (sectionId: string) => {
    setActiveNavSection(sectionId);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenTracker = () => {
    handleNavigate('tracker');
  };

  const handleGoToTracking = (orderId: string) => {
    setSelectedTrackingOrderId(orderId);
    handleNavigate('tracker');
  };

  const handleAddReview = (newRev: CustomerReview) => {
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your verified review has been published.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#242424]">
      {/* Top Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#23382B] text-white px-4 py-3 rounded-xl shadow-xl border border-[#3E5C48] text-xs font-medium flex items-center gap-2 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <Header
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={handleOpenTracker}
        onNavigate={handleNavigate}
        activeSection={activeNavSection}
        onSearchClick={() => {
          handleNavigate('catalog');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner */}
        <HeroBanner
          onExploreCatalog={() => handleNavigate('catalog')}
          onTrackOrder={handleOpenTracker}
        />

        {/* Online Catalog Section */}
        <CatalogSection
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Delivery Scheduling Guide */}
        <DeliveryInfoSection
          onScheduleNow={() => {
            if (cartItems.length > 0) {
              setIsCheckoutOpen(true);
            } else {
              handleNavigate('catalog');
            }
          }}
        />

        {/* Order Tracking System */}
        <OrderTrackerSection
          orders={orders}
          selectedOrderId={selectedTrackingOrderId}
          onSelectOrder={(id) => setSelectedTrackingOrderId(id)}
          onAdvanceOrderStatus={handleAdvanceOrderStatus}
        />

        {/* Customer Reviews Section */}
        <CustomerReviewsSection
          reviews={reviews}
          onAddReview={handleAddReview}
        />

        {/* Atelier Craft & Philosophy Section */}
        <AtelierCraftSection />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTracker={handleOpenTracker}
      />

      {/* Product Detail Customizer Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout & Delivery Scheduling Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems.length > 0 ? cartItems : [
          {
            id: 'sample-cart-item',
            product: PRODUCTS[0],
            size: 'Standard',
            sizeMultiplier: 1.0,
            vase: null,
            quantity: 1,
            calculatedPrice: PRODUCTS[0].basePrice,
          }
        ]}
        onOrderCreated={handleOrderCreated}
        onGoToTracking={handleGoToTracking}
      />
    </div>
  );
}
