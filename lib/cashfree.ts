// lib/cashfree.ts
// Cashfree Payment Gateway integration helper (REST API v2023-08-01)

export const CASHFREE_CONFIG = {
  appId: process.env.CASHFREE_APP_ID || '',
  secretKey: process.env.CASHFREE_SECRET_KEY || '',
  env: process.env.CASHFREE_ENV || 'production',
  apiVersion: '2023-08-01',
};

const getBaseUrl = () => {
  return CASHFREE_CONFIG.env === 'sandbox'
    ? 'https://sandbox.cashfree.com/pg'
    : 'https://api.cashfree.com/pg';
};

interface CreateOrderParams {
  orderId: string;
  orderAmount: number;
  customerEmail: string;
  customerPhone?: string;
  customerName?: string;
  orderNote?: string;
  returnUrl?: string;
}

export async function createCashfreeOrder(params: CreateOrderParams) {
  const url = `${getBaseUrl()}/orders`;

  // Customer ID must be alphanumeric and max 50 chars
  const sanitizedCustomerId = `cust_${params.customerEmail.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30)}_${Date.now().toString().slice(-4)}`;

  // Default phone fallback if user did not provide phone (Cashfree requires customer_phone to be 10 digits)
  const rawPhone = (params.customerPhone || '9441230144').replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.length === 10 ? rawPhone : '9441230144';

  const payload = {
    order_id: params.orderId,
    order_amount: Number(params.orderAmount.toFixed(2)),
    order_currency: 'INR',
    customer_details: {
      customer_id: sanitizedCustomerId,
      customer_email: params.customerEmail,
      customer_phone: cleanPhone,
      customer_name: params.customerName || params.customerEmail.split('@')[0],
    },
    order_meta: {
      return_url: params.returnUrl || null,
      payment_methods: 'cc,dc,upi,nb',
    },
    order_note: params.orderNote || 'VeriCar Service Order',
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-version': CASHFREE_CONFIG.apiVersion,
      'x-client-id': CASHFREE_CONFIG.appId,
      'x-client-secret': CASHFREE_CONFIG.secretKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Cashfree] Order creation error:', data);
    throw new Error(data?.message || 'Failed to create Cashfree order');
  }

  return data;
}

export async function getCashfreeOrderStatus(orderId: string) {
  const url = `${getBaseUrl()}/orders/${encodeURIComponent(orderId)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-version': CASHFREE_CONFIG.apiVersion,
      'x-client-id': CASHFREE_CONFIG.appId,
      'x-client-secret': CASHFREE_CONFIG.secretKey,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[Cashfree] Order status error:', data);
    throw new Error(data?.message || 'Failed to fetch Cashfree order status');
  }

  return data;
}
