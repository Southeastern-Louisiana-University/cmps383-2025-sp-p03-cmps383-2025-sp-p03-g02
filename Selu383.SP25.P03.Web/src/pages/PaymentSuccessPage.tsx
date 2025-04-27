import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" 
         style={{ minHeight: "calc(100vh - 100px)", padding: "20px" }}>
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      
      <h2 className="text-center mb-3" style={{ color: '#0d6efd', fontWeight: 'bold' }}>
        Payment Successful
      </h2>
      
      <p className="text-center text-muted mb-3">
        Thank you for your payment. Your order is being processed.
      </p>
      
      <div className="mb-3">
        <span>Amount Paid: </span>
        <span>${"99.99"}</span>
      </div>
      
      <button 
        className="btn btn-danger"
        onClick={() => navigate('/')}
        style={{ 
          width: '300px', 
          backgroundColor: '#dc3545',
          padding: '10px'
        }}
      >
        Return to Home Page
      </button>
    </div>
  );
};

export default PaymentSuccessPage;