import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ServiceAddon } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';

export const AddonsView: React.FC = () => {
  const { addons, services, addAddon, updateAddon, deleteAddon } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<ServiceAddon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [serviceId, setServiceId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(60);
  const [duration, setDuration] = useState('+30 mins');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingAddon(null);
    setServiceId(services[0]?.id || '');
    setName('');
    setPrice(60);
    setDuration('+30 mins');
    setIsActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (adn: ServiceAddon) => {
    setEditingAddon(adn);
    setServiceId(adn.serviceId);
    setName(adn.name);
    setPrice(adn.price);
    setDuration(adn.duration || '+30 mins');
    setIsActive(adn.isActive);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Add-on name is required');
      return;
    }
    if (!serviceId) {
      setFormError('Parent service is required');
      return;
    }
    if (price <= 0) {
      setFormError('Price must be greater than 0 AED');
      return;
    }

    if (editingAddon) {
      updateAddon(editingAddon.id, {
        serviceId,
        name: name.trim(),
        price: Number(price),
        duration: duration.trim(),
        isActive,
      });
    } else {
      addAddon({
        serviceId,
        name: name.trim(),
        price: Number(price),
        duration: duration.trim(),
        isActive,
      });
    }

    setModalOpen(false);
  };

  const filteredAddons = addons.filter((adn) => {
    const matchesSearch = adn.name.toLowerCase().includes(search.toLowerCase());
    const matchesService =
      selectedServiceFilter === 'all' || adn.serviceId === selectedServiceFilter;
    return matchesSearch && matchesService;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add-ons Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage optional extra cleaning items customers can add to their bookings
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Add-on</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search add-on names..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

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
            Showing {filteredAddons.length} add-ons
          </span>
        </div>

        {/* Add-ons Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Add-on Item</th>
                <th className="py-3 px-4">Associated Service</th>
                <th className="py-3 px-4">Extra Time</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredAddons.map((adn) => {
                const parentService = services.find((s) => s.id === adn.serviceId);

                return (
                  <tr key={adn.id} className="hover:bg-slate-50/60 transition group">
                    {/* Add-on Name */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-slate-900 text-sm">{adn.name}</span>
                      </div>
                    </td>

                    {/* Associated Service */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {parentService?.name || 'General Service'}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {adn.duration ? (
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {adn.duration}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      AED {adn.price}
                    </td>

                    {/* Active toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => updateAddon(adn.id, { isActive: !adn.isActive })}
                        className="cursor-pointer"
                        title={adn.isActive ? 'Active on booking flow' : 'Inactive'}
                      >
                        {adn.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(adn)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit Add-on"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(adn.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Add-on"
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

      {/* Add / Edit Add-on Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAddon ? 'Edit Add-on Option' : 'Add New Add-on Option'}
        subtitle="Manage extras like refrigerator interior clean, oven degrease, etc."
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
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Add-on Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Refrigerator Internal Wash & Descaling"
              maxLength={60}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Add-on Price (AED) *
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

            {/* Added Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Added Time
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. +30 mins"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Active status */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                Make add-on available for booking on user portal
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
              {editingAddon ? 'Save Add-on' : 'Create Add-on'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteAddon(deletingId);
        }}
        title="Delete Add-on"
        message="Are you sure you want to remove this add-on from the catalog?"
      />
    </div>
  );
};
