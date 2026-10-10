import React, { useEffect, useState } from 'react';
import { CheckCircle } from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

interface PaymentSuccessPageProps {
  onBackToHome?: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ onBackToHome }) => {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get('id') || params.get('orderId') || params.get('booking_id'));
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (onBackToHome) {
      e.preventDefault();
      onBackToHome();
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-[120px] pb-24 px-4 flex items-center justify-center">
      <div className="max-w-[500px] w-full bg-white rounded-[28px] border border-[#DCEBF8] p-8 sm:p-12 shadow-xl text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto">
          <CheckCircle size={48} weight="fill" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0084FF]" style={{ fontFamily: M }}>
            Payment Successful!
          </span>
          <h2 className="mt-2 text-[#0C3352] text-2xl font-extrabold" style={{ fontFamily: M }}>
            Your Payment has been received.
          </h2>
          {orderId && (
            <p className="mt-4 text-[#5A6E7F] text-sm" style={{ fontFamily: M }}>
              Order/Booking Reference: <span className="font-extrabold text-[#0C3352]">#{orderId}</span>
            </p>
          )}
          <p className="mt-2 text-[#5A6E7F] text-sm" style={{ fontFamily: M }}>
            We have sent a confirmation email &amp; SMS.
          </p>
        </div>

        <div className="pt-6">
          <button
            onClick={handleHomeClick}
            className="w-full rounded-full bg-grad-primary-cta py-4 text-center text-[#0C3352] font-extrabold text-base shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            style={{ fontFamily: M }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
