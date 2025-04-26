import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [stripeInstance, setStripeInstance] = useState<any>(null);
    
    useEffect(() => {
        const fetchConfig = async () => {
          try {
            const response = await fetch('http://localhost:5249/api/payment/config');
            const { publishableKey } = await response.json();
            
            if (publishableKey) {
              const stripeObj = await loadStripe(publishableKey);
              setStripeInstance(stripeObj);
            }
          } catch (error) {
            console.error("Failed to load Stripe configuration", error);
          }
        };
        
        fetchConfig();
      }, []);
  
 
  const handleCheckout = async () => {
    if (!stripeInstance) {
      alert('Payment system is still initializing. Please try again in a moment.');
      return;
    }
   
    setIsLoading(true);
   
    try {
      // NOTE -- Making API call to backend to create a checkout session
      const response = await fetch('http://localhost:5249/api/payment/createcheckoutsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
     
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
     
      const session = await response.json();
     
      const result = await stripeInstance.redirectToCheckout({
        sessionId: session.id
      });
     
      if (result.error) {
        console.error(result.error.message);
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Payment processing error. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };
 
  return (
    <div className="container mt-3">
      <div className="py-3 text-center">
        <h2 className="mb-3">Checkout</h2>
        <p className="mb-3">Click the button below to proceed with your payment using Stripe.</p>
        <button
          type="button"
          className="btn btn-danger btn-lg"
          onClick={handleCheckout}
          disabled={isLoading || !stripeInstance}
          style={{
            borderRadius: '4px',
            padding: '10px 20px',
            touchAction: 'manipulation'
          }}
        >
          {isLoading ? 'Processing...' : 'Purchase Items'}
        </button>
      </div>
    </div>
  );
};


export default CheckoutPage;
