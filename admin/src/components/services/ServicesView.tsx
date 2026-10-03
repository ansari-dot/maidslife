import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Check,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ServiceItem } from '../../types';
import { DynamicIcon, AVAILABLE_ICONS } from '../common/IconHelper';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FileUploadInput } from '../common/FileUploadInput';

export const ServicesView: React.FC = () => {
  const {
    services,
    categories,
    variants,
    addService,
    updateService,
    deleteService,
    setActiveTab,
  } = useAdmin();

  const [search, setSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [categoryId, setCategoryId] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(120);
  const [image, setImage] = useState('');
  const [iconName, setIconName] = useState('Sparkles');
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingService(null);
    setCategoryId(categories[0]?.id || '');
    setName('');
    setSlug('');
    setTagline('');
    setDescription('');
    setStartingPrice(120);
    setImage('');
    setIconName('Sparkles');
    setFeatures([]);
    setFeatureInput('');
    setStatus('active');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (srv: ServiceItem) => {
    setEditingService(srv);
    setCategoryId(srv.categoryId);
    setName(srv.name);
    setSlug(srv.slug);
    setTagline(srv.tagline || '');
    setDescription(srv.description || '');
    setStartingPrice(srv.startingPrice);
    setImage(srv.image || '');
    setIconName(srv.iconName || 'Sparkles');
    setFeatures(srv.features || []);
    setFeatureInput('');
    setStatus(srv.status);
    setFormError('');
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingService) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  const addFeatureItem = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeatureItem = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Service name is required');
      return;
    }
    if (!categoryId) {
      setFormError('Parent category must be selected');
      return;
    }
    if (features.length === 0) {
      setFormError('At least 1 feature bullet point is required');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        startingPrice: Number(startingPrice),
        image,
        iconName,
        features,
        status,
      });
    } else {
      addService({
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        startingPrice: Number(startingPrice),
        image,
        iconName,
        features,
        status,
        rating: 4.8,
      });
    }

    setModalOpen(false);
  };

  const filteredServices = services.filter((srv) => {
    const matchesSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      srv.slug.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'all' || srv.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Services Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage individual cleaning service offerings and specifications
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Service</span>
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
                placeholder="Search services..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Category Filter Dropdown */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredServices.length} of {services.length} services
          </span>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Image</th>
                <th className="py-3 px-4">Service Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Starting Price</th>
                <th className="py-3 px-4 text-center">Variants</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredServices.map((srv) => {
                const parentCat = categories.find((c) => c.id === srv.categoryId);
                const linkedVariants = variants.filter((v) => v.serviceId === srv.id);

                return (
                  <tr key={srv.id} className="hover:bg-slate-50/60 transition group">
                    {/* Thumbnail */}
                    <td className="py-3 px-5">
                      <img
                        src={srv.image}
                        alt={srv.name}
                        className="w-12 h-10 rounded-lg object-cover border border-slate-200 shadow-2xs"
                      />
                    </td>

                    {/* Name & Tagline */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <DynamicIcon name={srv.iconName} className="w-3.5 h-3.5 text-sky-600" />
                        <span className="font-bold text-slate-900 text-sm">{srv.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                        {srv.tagline}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {parentCat?.name || 'Uncategorized'}
                      </span>
                    </td>

                    {/* Starting Price */}
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      AED {srv.startingPrice}
                    </td>

                    {/* Variants Count & Shortcut */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setActiveTab('variants')}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                        title="Click to view & manage variants"
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>{linkedVariants.length}</span>
                      </button>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                        {srv.rating.toFixed(1)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          srv.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : srv.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {srv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(srv)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit Service"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(srv.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Service"
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

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service Offering' : 'Add New Service Offering'}
        subtitle="Configure service specifications, starting price, and features"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Title *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Deep Cleaning Services"
                maxLength={80}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. deep-cleaning-service"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Starting Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Starting Price (AED) *
              </label>
              <input
                type="number"
                min={0}
                value={startingPrice}
                onChange={(e) => setStartingPrice(Number(e.target.value))}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Marketing Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Marketing Tagline (Max 120 chars)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Spotless homes with vetted, background-checked professional maids"
              maxLength={120}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description Scope
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Full service scope and cleaning steps..."
              rows={3}
              maxLength={1000}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Features Dynamic Bullet Points List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Included Service Features / Highlights *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                placeholder="Add bullet highlight (e.g. Floor scrubbing, Inside oven wash)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeatureItem();
                  }
                }}
              />
              <button
                type="button"
                onClick={addFeatureItem}
                className="px-3 py-1.5 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-xl text-xs font-semibold"
              >
                + Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => removeFeatureItem(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* File Upload Input */}
          <FileUploadInput
            label="Service Banner Image *"
            value={image}
            onChange={(url) => setImage(url)}
            hint="Click or drag to upload service banner image file (PNG, JPG, WebP)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Icon */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Service Icon
              </label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                {AVAILABLE_ICONS.map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catalog Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="active">Active (Visible)</option>
                <option value="draft">Draft (Internal)</option>
                <option value="archived">Archived</option>
              </select>
            </div>
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
              {editingService ? 'Save Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteService(deletingId);
        }}
        title="Delete Service"
        message="Are you sure you want to delete this service? All linked variants and customer booking options will be affected."
      />
    </div>
  );
};
