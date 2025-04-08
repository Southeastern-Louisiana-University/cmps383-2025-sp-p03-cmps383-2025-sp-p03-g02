import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_your_publishable_key');

interface StripeCheckoutButtonProps {
  amount: number; 
  productName: string;
  description?: string;
}

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({ 
  amount, 
  productName, 
  description = '' 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const response = await fetch('/api/StripeCheckout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), 
          productName,
          description
        }),
      });

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url;
      } else {
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          setError(result.error.message || 'Something went wrong');
        }
      }
    } catch (err) {
      setError('Payment system error. Please try again later.');
      console.error('Stripe checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-checkout-button">
      <button 
        onClick={handleClick} 
        disabled={loading}
        className="payment-button"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default StripeCheckoutButton;