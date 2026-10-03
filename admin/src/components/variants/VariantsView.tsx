import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Clock,
  Tag,
  Percent,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ServiceVariant } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const VariantsView: React.FC = () => {
  const { variants, services, addVariant, updateVariant, deleteVariant } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ServiceVariant | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [serviceId, setServiceId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(150);
  const [originalPrice, setOriginalPrice] = useState<number>(200);
  const [duration, setDuration] = useState('2.5 Hours');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingVariant(null);
    setServiceId(services[0]?.id || '');
    setName('');
    setPrice(150);
    setOriginalPrice(200);
    setDuration('2.5 Hours');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (v: ServiceVariant) => {
    setEditingVariant(v);
    setServiceId(v.serviceId);
    setName(v.name);
    setPrice(v.price);
    setOriginalPrice(v.originalPrice || v.price);
    setDuration(v.duration);
    setDescription(v.description || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Variant name is required');
      return;
    }
    if (!serviceId) {
      setFormError('Parent service must be selected');
      return;
    }
    if (price <= 0) {
      setFormError('Selling price must be greater than 0');
      return;
    }
    if (originalPrice < price) {
      setFormError('Original price must be greater than or equal to discounted price');
      return;
    }

    if (editingVariant) {
      updateVariant(editingVariant.id, {
        serviceId,
        name: name.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        duration: duration.trim(),
        description: description.trim(),
      });
    } else {
      addVariant({
        serviceId,
        name: name.trim(),
        price: Number(price),
        originalPrice: Number(originalPrice),
        duration: duration.trim(),
        description: description.trim(),
      });
    }

    setModalOpen(false);
  };

  const filteredVariants = variants.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesService =
      selectedServiceFilter === 'all' || v.serviceId === selectedServiceFilter;
    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Service Variants & Options
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage specific unit pricing, apartment sizes, and durations per service
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Variant</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search variant titles..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Service filter */}
            <select
              value={selectedServiceFilter}
              onChange={(e) => setSelectedServiceFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Services ({services.length})</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredVariants.length} variants
          </span>
        </div>

        {/* Variants Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Parent Service</th>
                <th className="py-3 px-4">Variant Title & Description</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Discounted Price</th>
                <th className="py-3 px-4">Original Price</th>
                <th className="py-3 px-4 text-center">Savings</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredVariants.map((v) => {
                const parentService = services.find((s) => s.id === v.serviceId);
                const discount =
                  v.originalPrice > v.price
                    ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
                    : 0;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/60 transition group">
                    {/* Service */}
                    <td className="py-3 px-5">
                      <span className="font-semibold text-slate-900 block">
                        {parentService?.name || 'Unassigned Service'}
                      </span>
                    </td>

                    {/* Variant Name & Description */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800 text-sm">{v.name}</p>
                      {v.description && (
                        <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                          {v.description}
                        </p>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-700">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {v.duration}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-extrabold text-sky-700 text-sm whitespace-nowrap">
                      AED {v.price}
                    </td>

                    {/* Original Price */}
                    <td className="py-3 px-4 text-slate-400 line-through whitespace-nowrap">
                      AED {v.originalPrice}
                    </td>

                    {/* Savings Tag */}
                    <td className="py-3 px-4 text-center">
                      {discount > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {discount}% OFF
                        </span>
                      ) : (
                        <span className="text-slate-300 text-[11px]">Regular</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit Variant"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(v.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Variant"
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

      {/* Add / Edit Variant Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingVariant ? 'Edit Service Variant' : 'Add Service Variant'}
        subtitle="Specify variant pricing, unit size, and duration"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Service *
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (from AED {s.startingPrice})
                </option>
              ))}
            </select>
          </div>

          {/* Variant Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Variant Title *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 2 Bedroom Apartment or 3-Seater Sofa"
              maxLength={60}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Selling Price (AED) *
              </label>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Original Price (AED) *
              </label>
              <input
                type="number"
                min={1}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Est. Duration *
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3.5 Hours"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Scope Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 2 Maids for 2 hours with floor scrubbing and sanitizing materials"
              rows={2}
              maxLength={200}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
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
              {editingVariant ? 'Save Variant' : 'Create Variant'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteVariant(deletingId);
        }}
        title="Delete Variant"
        message="Are you sure you want to delete this variant? Any customer selections or recurring bookings for this option will be affected."
      />
    </div>
  );
};
