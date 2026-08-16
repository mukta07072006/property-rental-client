import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe with your Publishable Key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      alert(error.message);
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={isProcessing || !stripe} style={{ marginTop: '20px' }}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function App() {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Fetch PaymentIntent client secret from your backend
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 2500 }), // $25.00
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  return (
    <div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}