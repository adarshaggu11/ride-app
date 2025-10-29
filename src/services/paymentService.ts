// Cash Payment Service
interface PaymentMethod {
  id: string;
  type: 'cash';
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
    { id: 'cash', type: 'cash', name: 'Cash Payment', icon: '�', isDefault: true },
  ];

  getAvailableMethods(): PaymentMethod[] {
    return this.availableMethods;
  }

  async initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Only cash payment is supported
      console.log('Processing cash payment:', request);
      return await this.processCashPayment(request);
    } catch (error) {
      console.error('Payment failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment failed',
        timestamp: Date.now(),
      };
    }
  }

  private async processCashPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // Cash payment is marked as pending until driver confirms
    return {
      success: true,
      transactionId: `CASH${Date.now()}`,
      message: 'Cash payment - Pay driver directly after ride',
      timestamp: Date.now(),
    };
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
