import React from 'react';

const M = 'Montserrat, sans-serif';

interface BookingSummaryProps {
  categories: any[];
  selectedCategory: string;
  selectedService: any | null;
  professionalsCount: number;
  hours: number;
  selectedAddonIds: string[];
  selectedDate: string;
  selectedTimeSlot: string;
  basePrice: number;
  appliedCoupon: any | null;
  discountAmount: number;
  totalPrice: number;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  categories,
  selectedCategory,
  selectedService,
  professionalsCount,
  hours,
  selectedAddonIds,
  selectedDate,
  selectedTimeSlot,
  basePrice,
  appliedCoupon,
  discountAmount,
  totalPrice,
}) => {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-white rounded-[24px] border border-[#DCEBF8] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        <h3 className="text-[#0C3352] font-extrabold text-lg border-b border-slate-100 pb-3" style={{ fontFamily: M }}>
          Booking Summary
        </h3>

        <div className="space-y-3 text-xs" style={{ fontFamily: M }}>
          <div className="flex justify-between items-center text-slate-500">
            <span>Category</span>
            <span className="font-bold text-[#0084FF]">
              {categories.find((c) => c.id === selectedCategory)?.name || 'Residential Cleaning'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500">
            <span>Service</span>
            <span className="font-bold text-[#0C3352]">{selectedService?.name}</span>
          </div>

          <div className="flex justify-between items-start text-slate-500">
            <span>Duration (Hours)</span>
            <span className="font-bold text-[#0C3352]">{hours} Hour(s)</span>
          </div>

          <div className="flex justify-between items-start text-slate-500">
            <span>Number of Professionals</span>
            <span className="font-bold text-[#0C3352]">{professionalsCount}</span>
          </div>

          {selectedAddonIds.length > 0 && selectedService?.addons && (
            <div className="flex justify-between items-start text-slate-500">
              <span>Add-ons ({selectedAddonIds.length})</span>
              <div className="text-right">
                {selectedService?.addons
                  ?.filter((a: any) => selectedAddonIds.includes(a.id))
                  .map((a: any) => (
                    <span key={a.id} className="block font-bold text-[#0C3352]">
                      + {a.name} (AED {a.price})
                    </span>
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-500">
            <span>Date &amp; Time</span>
            <span className="font-bold text-[#0C3352]">{selectedDate}, {selectedTimeSlot}</span>
          </div>
        </div>

        {/* PAYMENT SUMMARY */}
        <div className="pt-4 border-t border-slate-100 space-y-2 text-xs" style={{ fontFamily: M }}>
          <div className="flex justify-between text-slate-500">
            <span>Base Subtotal</span>
            <span>AED {basePrice.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-AED {discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[#0C3352]">
            <span className="font-bold text-sm">Total Amount</span>
            <span className="font-extrabold text-2xl text-[#0084FF]">
              AED {totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
