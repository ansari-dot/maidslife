import React from 'react';
import { XCircle } from '@phosphor-icons/react';

const M = "'Manrope', sans-serif";

interface PaymentFailedPageProps {
  onBackToHome?: () => void;
  onRetryBooking?: () => void;
}

export const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({
  onBackToHome,
  onRetryBooking,
}) => {
  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen pt-[120px] pb-24 px-4 flex items-center justify-center">
      <div className="max-w-[500px] w-full bg-white rounded-[28px] border border-[#DCEBF8] p-8 sm:p-12 shadow-xl text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
          <XCircle size={48} weight="fill" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-red-600" style={{ fontFamily: M }}>
            Payment Failed
          </span>
          <h2 className="mt-2 text-[#0C3352] text-2xl font-extrabold" style={{ fontFamily: M }}>
            Your payment could not be completed.
          </h2>
          <p className="mt-2 text-[#5A6E7F] text-sm" style={{ fontFamily: M }}>
            Please try again or use a different payment method.
          </p>
        </div>

        <div className="pt-6 flex flex-col gap-3">
          <button
            onClick={() => onRetryBooking ? onRetryBooking() : window.location.assign('/booking')}
            className="w-full rounded-full bg-grad-primary-cta py-4 text-center text-[#0C3352] font-extrabold text-base shadow-md hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            style={{ fontFamily: M }}
          >
            Try Again
          </button>
          <button
            onClick={() => onBackToHome ? onBackToHome() : window.location.assign('/')}
            className="w-full rounded-full border border-slate-200 py-4 text-center text-[#0C3352] font-bold text-base hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
            style={{ fontFamily: M }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
