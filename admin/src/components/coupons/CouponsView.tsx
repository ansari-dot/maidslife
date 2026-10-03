import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Tag,
  Percent,
  Calendar,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { PromoCoupon } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, notify } = useAdmin();

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<PromoCoupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(150);
  const [maxDiscount, setMaxDiscount] = useState<number>(100);
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [validFrom, setValidFrom] = useState('2026-09-01');
  const [validUntil, setValidUntil] = useState('2026-10-31');
  const [isActive, setIsActive] = useState(true);
  const [isDisplayedOnCheckout, setIsDisplayedOnCheckout] = useState(false);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDiscountType('percentage');
    setDiscountValue(20);
    setMinOrderAmount(150);
    setMaxDiscount(100);
    setUsageLimit(500);
    setValidFrom('2026-09-01');
    setValidUntil('2026-10-31');
    setIsActive(true);
    setIsDisplayedOnCheckout(false);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c: PromoCoupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(c.discountValue);
    setMinOrderAmount(c.minOrderAmount || 0);
    setMaxDiscount(c.maxDiscount || 0);
    setUsageLimit(c.usageLimit);
    setValidFrom(c.validFrom);
    setValidUntil(c.validUntil);
    setIsActive(c.isActive);
    setIsDisplayedOnCheckout(c.isDisplayedOnCheckout || false);
    setFormError('');
    setModalOpen(true);
  };

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    notify('Coupon code copied to clipboard', 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setFormError('Coupon code is required');
      return;
    }
    if (discountValue <= 0) {
      setFormError('Discount value must be greater than zero');
      return;
    }

    const formattedCode = code.toUpperCase().trim().replace(/[^A-Z0-9_-]/g, '');

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, {
        code: formattedCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        validUntil,
        isActive,
        isDisplayedOnCheckout,
      });
    } else {
      addCoupon({
        code: formattedCode,
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
        usageLimit: Number(usageLimit),
        validFrom,
        validUntil,
        isActive,
        isDisplayedOnCheckout,
      });
    }

    setModalOpen(false);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Promo Codes & Coupons</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure discount incentives, seasonal promotions, and minimum order rules
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search coupon code..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredCoupons.length} coupons
          </span>
        </div>

        {/* Coupons Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Coupon Code</th>
                <th className="py-3 px-4">Discount Value</th>
                <th className="py-3 px-4">Min. Order</th>
                <th className="py-3 px-4">Redemptions</th>
                <th className="py-3 px-4">Validity Window</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCoupons.map((c) => {
                const isExpired = new Date(c.validUntil) < new Date();
                const usagePercent = Math.min(Math.round((c.usedCount / c.usageLimit) * 100), 100);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition group">
                    {/* Code with Copy */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs tracking-wider">
                          {c.code}
                        </span>
                        <button
                          onClick={() => handleCopy(c.code)}
                          className="text-slate-400 hover:text-sky-600 transition"
                          title="Copy code"
                        >
                          {copiedCode === c.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-sky-700 text-sm">
                        {c.discountType === 'percentage'
                          ? `${c.discountValue}% OFF`
                          : `AED ${c.discountValue} OFF`}
                      </span>
                      {c.maxDiscount && (
                        <p className="text-[10px] text-slate-400">Up to AED {c.maxDiscount}</p>
                      )}
                    </td>

                    {/* Min Order */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {c.minOrderAmount ? `AED ${c.minOrderAmount}` : 'No minimum'}
                    </td>

                    {/* Redemptions Progress */}
                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-800">{c.usedCount}</span>
                          <span className="text-slate-400">of {c.usageLimit}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              usagePercent > 85 ? 'bg-amber-500' : 'bg-sky-500'
                            }`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Validity */}
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      <p className="text-[11px] font-medium text-slate-800">{c.validUntil}</p>
                      <p className="text-[10px] text-slate-400">From {c.validFrom}</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {isExpired ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Expired
                        </span>
                      ) : c.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          Paused
                        </span>
                      )}
                      
                      {c.isDisplayedOnCheckout && !isExpired && (
                        <div className="mt-1.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                            Displayed on Checkout
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit Coupon"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCoupon ? 'Edit Promo Coupon' : 'Create New Promo Coupon'}
        subtitle="Configure discount rules, usage limits, and redemption criteria"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER20"
                maxLength={20}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Type *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="percentage">Percentage Discount (%)</option>
                <option value="fixed">Fixed Amount Discount (AED)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Min. Order (AED)
              </label>
              <input
                type="number"
                min={0}
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Usage Cap Limit
              </label>
              <input
                type="number"
                min={1}
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valid From
              </label>
              <input
                type="date"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                Coupon code is active and redeemable by customers
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer pt-3">
              <input
                type="checkbox"
                checked={isDisplayedOnCheckout}
                onChange={(e) => setIsDisplayedOnCheckout(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                Feature and display this promo code on the Checkout Page
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition"
            >
              {editingCoupon ? 'Save Changes' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteCoupon(deletingId);
        }}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? Customers will no longer be able to use it."
      />
    </div>
  );
};
