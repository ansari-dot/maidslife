import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  MapPin,
  Star,
  Eye,
  Sliders,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { TransformationItem } from '../../types';
import { BeforeAfterSlider } from '../common/BeforeAfterSlider';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FileUploadInput } from '../common/FileUploadInput';

export const GalleryView: React.FC = () => {
  const {
    transformations,
    services,
    addTransformation,
    updateTransformation,
    deleteTransformation,
    currentUserRole,
  } = useAdmin();

  const isSuperAdmin = currentUserRole === 'Super Admin';

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TransformationItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sofa Cleaning');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [beforeImg, setBeforeImg] = useState('');
  const [afterImg, setAfterImg] = useState('');
  const [cleanerName, setCleanerName] = useState('');
  const [location, setLocation] = useState('Dubai Marina');
  const [customerReview, setCustomerReview] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Sofa Cleaning');
    setServiceId(services[0]?.id || '');
    setBeforeImg('');
    setAfterImg('');
    setCleanerName('');
    setLocation('Dubai Marina');
    setCustomerReview('');
    setIsFeatured(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (item: TransformationItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setServiceId(item.serviceId);
    setBeforeImg(item.beforeImg);
    setAfterImg(item.afterImg);
    setCleanerName(item.cleanerName || 'Aisha Khan');
    setLocation(item.location || 'Dubai Marina');
    setCustomerReview(item.customerReview || '');
    setIsFeatured(item.isFeatured ?? true);
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Transformation title is required');
      return;
    }
    if (!beforeImg || !afterImg) {
      setFormError('Both Before and After images are required');
      return;
    }

    if (editingItem) {
      updateTransformation(editingItem.id, {
        title: title.trim(),
        category,
        serviceId,
        beforeImg,
        afterImg,
        cleanerName,
        location,
        customerReview,
        isFeatured,
      });
    } else {
      addTransformation({
        title: title.trim(),
        category,
        serviceId,
        beforeImg,
        afterImg,
        cleanerName,
        location,
        customerReview,
        isFeatured,
        date: 'Sep 2026',
      });
    }

    setModalOpen(false);
  };

  const categoriesList: string[] = ['all', ...Array.from(new Set(transformations.map((t: TransformationItem) => t.category)))];

  const filteredTransformations = transformations.filter((t: TransformationItem) =>
    categoryFilter === 'all' ? true : t.category === categoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Transformations Gallery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive 50/50 Before & After proof-of-work showcasing deep cleaning transformations
          </p>
        </div>
        {isSuperAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Transformation</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Services' : cat}
          </button>
        ))}
      </div>

      {/* Interactive Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTransformations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-slate-300 transition"
          >
            {/* Interactive Slider Area */}
            <div className="p-3">
              <BeforeAfterSlider
                beforeImg={item.beforeImg}
                afterImg={item.afterImg}
                category={item.category}
                heightClass="h-56"
              />
              <p className="text-[10px] text-center text-slate-400 mt-2 font-medium flex items-center justify-center gap-1">
                <Sliders className="w-3 h-3 text-sky-500" />
                Drag divider left / right to compare results
              </p>
            </div>

            {/* Info Card Content */}
            <div className="p-4 pt-1 flex-1 flex flex-col justify-between border-t border-slate-100">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition">
                    {item.title}
                  </h3>
                  {item.isFeatured && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span>By {item.cleanerName}</span>
                </div>

                {item.customerReview && (
                  <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic line-clamp-2">
                    "{item.customerReview}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{item.date}</span>
                <div className="flex items-center gap-1.5">
                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        title="Edit Item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Transformation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Transformation Showcase' : 'Add Transformation Showcase'}
        subtitle="Upload before & after imagery with customer review and cleaner credit"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Transformation Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Velvet Sofa Wine Stain Extraction"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              >
                <option value="Sofa Cleaning">Sofa Cleaning</option>
                <option value="Deep Cleaning">Deep Cleaning</option>
                <option value="Kitchen Deep Clean">Kitchen Deep Clean</option>
                <option value="Carpet Shampooing">Carpet Shampooing</option>
                <option value="Window Cleaning">Window Cleaning</option>
                <option value="Marble Polishing">Marble Polishing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operating Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dubai Marina"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Before & After File Upload Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUploadInput
              label="Before Cleaning Image *"
              value={beforeImg}
              onChange={(url) => setBeforeImg(url)}
              hint="Click or drag to upload Before Cleaning image file"
            />
            <FileUploadInput
              label="After Cleaning Image *"
              value={afterImg}
              onChange={(url) => setAfterImg(url)}
              hint="Click or drag to upload After Cleaning image file"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cleaned By (Staff Credit)
              </label>
              <input
                type="text"
                value={cleanerName}
                onChange={(e) => setCleanerName(e.target.value)}
                placeholder="e.g. Aisha Khan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Showcase on Home Page Carousel
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Quote / Testimonial
            </label>
            <textarea
              value={customerReview}
              onChange={(e) => setCustomerReview(e.target.value)}
              placeholder="e.g. Saved our couch from wine stains! Unbelievable before and after results."
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
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
              {editingItem ? 'Save Changes' : 'Create Showcase'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteTransformation(deletingId);
        }}
        title="Delete Transformation"
        message="Are you sure you want to remove this transformation showcase from the gallery?"
      />
    </div>
  );
};
