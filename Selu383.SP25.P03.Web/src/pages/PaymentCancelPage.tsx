import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancelPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="card p-4 shadow-sm">
            <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="red" 
                   className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
              </svg>
            </div>
            <h2 className="mb-3">Payment Cancelled</h2>
            <p className="lead mb-4">Your payment process was cancelled. No charges were made to your account.</p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/checkout')}
              >
                Try Again
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/')}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;