export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
  gateway: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  redirectUrl?: string;
  message: string;
}

export interface EMIOption {
  bank: string;
  tenure: number;
  monthlyInstallment: number;
  totalAmount: number;
  interestRate: number;
}

export interface PaymentGateway {
  name: string;
  code: string;
  initiate(req: PaymentRequest): Promise<PaymentResponse>;
  verify(transactionId: string): Promise<{ status: string; amount: number }>;
}

class MockPaymentGateway implements PaymentGateway {
  name: string;
  code: string;

  constructor(name: string, code: string) {
    this.name = name;
    this.code = code;
  }

  async initiate(req: PaymentRequest): Promise<PaymentResponse> {
    await new Promise((r) => setTimeout(r, 500));
    const txnId = `TXN-${this.code}-${Date.now()}`;
    return {
      success: true,
      transactionId: txnId,
      message: `Payment of ${req.currency} ${req.amount} initiated via ${this.name}`,
    };
  }

  async verify(transactionId: string): Promise<{ status: string; amount: number }> {
    await new Promise((r) => setTimeout(r, 300));
    return { status: 'completed', amount: 0 };
  }
}

export const paymentGateways: Record<string, PaymentGateway> = {
  sslcommerz: new MockPaymentGateway('SSLCommerz', 'SSL'),
  shurjopay: new MockPaymentGateway('ShurjoPay', 'SJP'),
  bkash: new MockPaymentGateway('bKash', 'BKS'),
  nagad: new MockPaymentGateway('Nagad', 'NGD'),
  rocket: new MockPaymentGateway('Rocket', 'RKT'),
  upay: new MockPaymentGateway('Upay', 'UPY'),
  card: new MockPaymentGateway('Card Payment', 'CRD'),
};

export function calculateEMI(amount: number, tenure: number, rate: number): EMIOption {
  const monthlyRate = rate / 12 / 100;
  const emi = rate === 0
    ? amount / tenure
    : (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1);
  return {
    bank: '',
    tenure,
    monthlyInstallment: Math.round(emi),
    totalAmount: Math.round(emi * tenure),
    interestRate: rate,
  };
}

export const emiPartnerBanks = [
  { bank: 'BRAC Bank', tenures: [3, 6, 9, 12], rate: 0 },
  { bank: 'Eastern Bank', tenures: [3, 6, 9, 12], rate: 0 },
  { bank: 'City Bank', tenures: [3, 6, 12, 18], rate: 0 },
  { bank: 'Dhaka Bank', tenures: [3, 6, 9], rate: 0 },
  { bank: 'Standard Chartered', tenures: [3, 6, 12, 24], rate: 0 },
  { bank: 'HSBC', tenures: [3, 6, 12], rate: 0 },
];

export function getEMIOptions(amount: number): EMIOption[] {
  const options: EMIOption[] = [];
  for (const partner of emiPartnerBanks) {
    for (const tenure of partner.tenures) {
      const emi = calculateEMI(amount, tenure, partner.rate);
      options.push({ ...emi, bank: partner.bank });
    }
  }
  return options;
}
