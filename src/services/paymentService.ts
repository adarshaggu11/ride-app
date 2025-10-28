// Multi-Payment Gateway Integration Service
interface PaymentMethod {
  id: string;
  type: 'upi' | 'wallet' | 'card' | 'cash' | 'netbanking';
  name: string;
  icon: string;
  details?: string;
  isDefault?: boolean;
}

interface PaymentRequest {
  amount: number;
  rideId: string;
  userId: string;
  method: PaymentMethod;
  splitPayment?: {
    amount: number;
    recipientId: string;
  }[];
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  timestamp: number;
}

class PaymentService {
  private availableMethods: PaymentMethod[] = [
    { id: 'upi', type: 'upi', name: 'UPI', icon: '💳' },
    { id: 'paytm', type: 'wallet', name: 'Paytm', icon: '🔵' },
    { id: 'phonepe', type: 'wallet', name: 'PhonePe', icon: '🟣' },
    { id: 'gpay', type: 'upi', name: 'Google Pay', icon: '🔴' },
    { id: 'cash', type: 'cash', name: 'Cash', icon: '💵' },
    { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'wallet', type: 'wallet', name: 'App Wallet', icon: '👛' },
  ];

  getAvailableMethods(): PaymentMethod[] {
    return this.availableMethods;
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulate payment processing
      console.log('Processing payment:', request);

      // Handle different payment methods
      switch (request.method.type) {
        case 'upi':
          return await this.processUPIPayment(request);
        case 'wallet':
          return await this.processWalletPayment(request);
        case 'card':
          return await this.processCardPayment(request);
        case 'cash':
          return await this.processCashPayment(request);
        default:
          throw new Error('Unsupported payment method');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed',
        timestamp: Date.now(),
      };
    }
  }

  private async processUPIPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Generate UPI deep link
    const upiUrl = this.generateUPILink(request);
    
    // In a real app, this would open the UPI app
    console.log('UPI Payment URL:', upiUrl);
    
    // Simulate payment success
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `UPI${Date.now()}`,
          message: 'Payment successful via UPI',
          timestamp: Date.now(),
        });
      }, 2000);
    });
  }

  private generateUPILink(request: PaymentRequest): string {
    const merchantUPI = 'merchant@upi'; // Replace with actual merchant UPI
    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: 'Mana Auto Oka Ride',
      am: request.amount.toString(),
      cu: 'INR',
      tn: `Ride payment for ${request.rideId}`,
    });
    return `upi://pay?${params.toString()}`;
  }

  private async processWalletPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Check wallet balance
    const balance = await this.getWalletBalance(request.userId);
    
    if (balance < request.amount) {
      return {
        success: false,
        message: 'Insufficient wallet balance',
        timestamp: Date.now(),
      };
    }

    // Deduct from wallet
    await this.deductFromWallet(request.userId, request.amount);

    return {
      success: true,
      transactionId: `WALLET${Date.now()}`,
      message: 'Payment successful via wallet',
      timestamp: Date.now(),
    };
  }

  private async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // In real implementation, integrate with payment gateway like Razorpay/Stripe
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `CARD${Date.now()}`,
          message: 'Payment successful via card',
          timestamp: Date.now(),
        });
      }, 2000);
    });
  }

  private async processCashPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Cash payment is marked as pending until driver confirms
    return {
      success: true,
      transactionId: `CASH${Date.now()}`,
      message: 'Cash payment - Pay driver directly',
      timestamp: Date.now(),
    };
  }

  async getWalletBalance(userId: string): Promise<number> {
    // Fetch from API
    const stored = localStorage.getItem(`wallet_${userId}`);
    return stored ? parseFloat(stored) : 0;
  }

  async addToWallet(userId: string, amount: number): Promise<void> {
    const current = await this.getWalletBalance(userId);
    localStorage.setItem(`wallet_${userId}`, (current + amount).toString());
  }

  async deductFromWallet(userId: string, amount: number): Promise<void> {
    const current = await this.getWalletBalance(userId);
    if (current < amount) throw new Error('Insufficient balance');
    localStorage.setItem(`wallet_${userId}`, (current - amount).toString());
  }

  async processSplitPayment(request: PaymentRequest): Promise<PaymentResponse> {
    if (!request.splitPayment || request.splitPayment.length === 0) {
      return await this.initiatePayment(request);
    }

    try {
      // Process each split payment
      const results = await Promise.all(
        request.splitPayment.map((split) =>
          this.initiatePayment({
            ...request,
            amount: split.amount,
            userId: split.recipientId,
          })
        )
      );

      const allSuccess = results.every((r) => r.success);

      return {
        success: allSuccess,
        transactionId: allSuccess ? `SPLIT${Date.now()}` : undefined,
        message: allSuccess
          ? 'Split payment successful'
          : 'Some payments failed',
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Split payment failed',
        timestamp: Date.now(),
      };
    }
  }

  async applyPromoCode(code: string, amount: number): Promise<{ valid: boolean; discount: number; message: string }> {
    // Simulated promo codes
    const promoCodes: Record<string, { discount: number; minAmount: number }> = {
      'FIRST50': { discount: 50, minAmount: 100 },
      'SAVE20': { discount: 20, minAmount: 150 },
      'FESTIVAL25': { discount: 25, minAmount: 200 },
    };

    const promo = promoCodes[code.toUpperCase()];

    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }

    if (amount < promo.minAmount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum amount ₹${promo.minAmount} required`,
      };
    }

    return {
      valid: true,
      discount: promo.discount,
      message: `₹${promo.discount} discount applied!`,
    };
  }

  async getTransactionHistory(userId: string): Promise<any[]> {
    // Fetch from API
    return [];
  }
}

export const paymentService = new PaymentService();
export type { PaymentMethod, PaymentRequest, PaymentResponse };
