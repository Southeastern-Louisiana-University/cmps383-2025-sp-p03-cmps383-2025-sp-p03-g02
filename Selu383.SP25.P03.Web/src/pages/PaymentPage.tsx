import React from 'react';
import StripeCheckoutButton from '../components/StripeCheckoutButton';

const PaymentPage: React.FC = () => {
  return (
    <div className="payment-container">
      <h1>Complete Your Purchase</h1>
      <div className="product-details">
        <h2>Product Name</h2>
        <p>Product description goes here</p>
        <p className="price">Price: $29.99</p>
      </div>
      
      <div className="payment-form">
        <h2>Payment Details</h2>
        <StripeCheckoutButton 
          amount={29.99} 
          productName="Product Name" 
          description="Product description goes here" 
        />
      </div>
      
      <p className="payment-info">
        You will be redirected to Stripe's secure checkout page to complete your purchase.
      </p>
    </div>
  );
};

export default PaymentPage;