'use client';

import { useCallback } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

declare global {
  interface Window { Razorpay: any; }
}

const loadScript = (): Promise<boolean> => {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay)               return Promise.resolve(true);
  return new Promise(resolve => {
    const s    = document.createElement('script');
    s.src      = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload   = () => resolve(true);
    s.onerror  = () => resolve(false);
    document.body.appendChild(s);
  });
};

export interface RazorpayResult {
  razorpayOrderId:   string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface OpenCheckoutOptions {
  amount:      number;          // INR
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  onSuccess:  (r: RazorpayResult) => void;
  onFailure:  (msg: string)      => void;
}

export function useRazorpay() {
  const { user } = useUser();

  const openCheckout = useCallback(async (opts: OpenCheckoutOptions) => {
    const loaded = await loadScript();
    if (!loaded) { opts.onFailure('Failed to load Razorpay SDK'); return; }

    try {
      const data = await fetch('/api/payment/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ amount: opts.amount }),
      }).then(r => r.json());

      if (!data.orderId) throw new Error(data.message || 'Could not create order');

      const rzp = new window.Razorpay({
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        order_id:    data.orderId,
        name:        'Annaya Boutique',
        description: opts.description ?? 'Royal Fashion Purchase',
        prefill: {
          name:    opts.prefill?.name    ?? user?.name    ?? '',
          email:   opts.prefill?.email   ?? user?.email   ?? '',
          contact: opts.prefill?.contact ?? '',
        },
        theme:  { color: '#5A2D82' },
        modal:  { escape: false },
        handler: (res: any) => {
          opts.onSuccess({
            razorpayOrderId:   res.razorpay_order_id,
            razorpayPaymentId: res.razorpay_payment_id,
            razorpaySignature: res.razorpay_signature,
          });
        },
      });
      rzp.on('payment.failed', (res: any) =>
        opts.onFailure(res.error?.description ?? 'Payment failed')
      );
      rzp.open();
    } catch (err: any) {
      opts.onFailure(err.message ?? 'Payment initiation failed');
    }
  }, [user]);

  return { openCheckout };
}
