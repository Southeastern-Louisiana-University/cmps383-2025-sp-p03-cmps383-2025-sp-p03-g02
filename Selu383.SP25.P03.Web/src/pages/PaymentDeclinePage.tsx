import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentDeclinePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" 
         style={{ minHeight: "calc(100vh - 100px)", padding: "20px" }}>
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      </div>
      
      <h2 className="text-center mb-3" style={{ color: '#dc3545', fontWeight: 'bold' }}>
        Payment Declined
      </h2>
      
      <p className="text-center text-muted mb-3">
        Your payment could not be processed. Please try again with a different payment method.
      </p>
      
      <div className="mb-3 text-center">
        <p>Common reasons for declined payments:</p>
        <ul className="list-unstyled">
          <li>Insufficient funds</li>
          <li>Incorrect card information</li>
          <li>Expired card</li>
        </ul>
      </div>
      
      <div className="d-flex gap-3">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/checkout')}
          style={{ padding: '10px 20px' }}
        >
          Try Again
        </button>
        
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/')}
          style={{ padding: '10px 20px' }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentDeclinePage;