export interface StemItem {
  name: string;
  count: number;
}

export interface FlowerProduct {
  id: string;
  name: string;
  botanicName: string;
  category: 'Roses' | 'Peonies' | 'Wildflowers' | 'Orchids' | 'Lilies' | 'Seasonal';
  occasions: ('Anniversary' | 'Birthday' | 'Sympathy' | 'Romance' | 'Celebration' | 'Everyday')[];
  basePrice: number;
  originalPrice?: number;
  description: string;
  stemBreakdown: StemItem[];
  careInstructions: string[];
  scentProfile: string;
  bloomDuration: string;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  bestseller?: boolean;
}

export type BouquetSize = 'Standard' | 'Deluxe' | 'Grandeur';

export interface VaseOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CartItem {
  id: string;
  product: FlowerProduct;
  size: BouquetSize;
  sizeMultiplier: number;
  vase: VaseOption | null;
  quantity: number;
  calculatedPrice: number;
}

export interface DeliveryDetails {
  date: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  recipientName: string;
  recipientPhone: string;
  address: string;
  aptSuite?: string;
  city: string;
  postalCode: string;
  deliveryInstructions: string;
  includeCard: boolean;
  cardOccasion: string;
  cardMessage: string;
  cardSender: string;
  isAnonymous: boolean;
}

export interface PaymentDetails {
  method: 'card' | 'applepay' | 'googlepay' | 'cod';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  billingSameAsDelivery: boolean;
}

export type OrderStatus = 'confirmed' | 'arranging' | 'inspected' | 'out_for_delivery' | 'delivered';

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface CourierInfo {
  name: string;
  phone: string;
  vehicle: string;
  currentLocationName: string;
  temperature: string;
  etaMinutes: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  delivery: DeliveryDetails;
  payment: {
    method: string;
    last4?: string;
    amount: number;
    transactionId: string;
  };
  pricing: {
    subtotal: number;
    vaseTotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  status: OrderStatus;
  trackingSteps: TrackingStep[];
  courier?: CourierInfo;
}

export interface CustomerReview {
  id: string;
  productId?: string;
  productName: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  occasion: string;
  title: string;
  content: string;
  verified: boolean;
}
