export interface Product {
  id: string;
  name: string;
  category: "automation" | "game" | "marketing" | "seo" | "developer";
  price: number;
  originalPrice: number;
  commissionRate: number; // e.g. 15 for 15%
  rating: number;
  soldCount: number;
  stockCount: number;
  features: string[];
  description: string;
  instructions: string;
  downloadUrl: string;
}

export interface User {
  phoneNumberOrEmail: string;
  referralCode?: string;
  referralEarnings: number;
  isLoggedIn: boolean;
  isAdmin?: boolean;
  balance: number; // In-app top-up Balance in VNĐ for purchasing keys & opening lucky blind bags
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  price: number;
  keyDelivered: string;
  status: "pending" | "success" | "canceled";
  timestamp: string;
  buyerEmail: string;
  paymentMethod: "momo" | "vnpay" | "banking" | "balance";
  referralCodeUsed?: string;
  referralCommissionAmount?: number;
}

export interface Tutorial {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  content: string;
  readTime: string;
  views: number;
  hasAffiliateDisclosure: boolean;
}

export interface ConversionMetric {
  date: string;
  clicks: number;
  signups: number;
  sales: number;
  conversionRate: number; // signups to sales or clicks to sales
  revenue: number;
  commissions: number;
}

export interface DripEmail {
  id: string;
  step: number;
  triggerEvent: string;
  delayText: string;
  subject: string;
  body: string;
  purpose: string;
}
