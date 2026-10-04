import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Search,
  Sparkles,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { ServiceCategory } from '../../types';
import { DynamicIcon, AVAILABLE_ICONS } from '../common/IconHelper';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FileUploadInput, PresetOption } from '../common/FileUploadInput';
import { apiService } from '../../services/apiService';

const CATEGORY_PRESETS: PresetOption[] = [
  {
    label: 'Residential Cleaning',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Deep Home Clean',
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Commercial & Office',
    url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Upholstery & Sofa',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Move In / Out Clean',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  },
  {
    label: 'Disinfection & Sanitizing',
    url: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&auto=format&fit=crop&q=80',
  },
];

export const CategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdmin();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('House');
  const [image, setImage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIconName('House');
    setImage('');
    setSelectedFile(null);
    setSortOrder(categories.length + 1);
    setIsActive(true);
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (cat: ServiceCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIconName(cat.iconName || cat.icon || 'House');
    setImage(cat.image || '');
    setSelectedFile(null);
    setSortOrder(cat.sortOrder ?? 0);
    setIsActive(cat.isActive);
    setFormError('');
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const autoSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  };

  const handleImageChange = (fileUrl: string, file?: File) => {
    setImage(fileUrl);
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Category name is required');
      return;
    }
    if (!slug.trim()) {
      setFormError('Slug identifier is required');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      let finalImageUrl = image;

      // If a new local file was selected, upload it to the server first
      if (selectedFile) {
        try {
          const uploadRes = await apiService.uploadImage(selectedFile);
          if (uploadRes && uploadRes.url) {
            finalImageUrl = uploadRes.url;
          }
        } catch (uploadErr: any) {
          console.warn('Image upload fallback to data URL:', uploadErr);
          // Keep base64 string if server upload is unavailable
        }
      }

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          iconName,
          icon: iconName,
          image: finalImageUrl,
          sortOrder: Number(sortOrder),
          isActive,
        });
      } else {
        await addCategory({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          iconName,
          icon: iconName,
          image: finalImageUrl,
          sortOrder: Number(sortOrder),
          isActive,
        });
      }

      setModalOpen(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Categories Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage top-level service categories, category banner images, and icons
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category name or slug..."
              className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredCategories.length} categories
          </span>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Image & Icon</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4 text-center">Services</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">No categories found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {search ? 'Try adjusting your search criteria' : 'Click "Add Category" to create your first category'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/60 transition group">
                    {/* Category Image & Icon Thumbnail */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-2xs shrink-0 bg-slate-100 flex items-center justify-center">
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                          <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-md bg-white/90 backdrop-blur-xs text-sky-600 flex items-center justify-center shadow-2xs border border-slate-200/60">
                            <DynamicIcon name={cat.iconName || cat.icon || 'House'} className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-sm">{cat.name}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                        {cat.description || 'No description provided'}
                      </p>
                    </td>

                    {/* Slug */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      {cat.slug}
                    </td>

                    {/* Linked Services Count */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100">
                        {cat.servicesCount ?? 0}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                        className="cursor-pointer transition"
                        title={cat.isActive ? 'Active on customer portal' : 'Inactive / hidden'}
                      >
                        {cat.isActive ? (
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
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(cat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => !isSaving && setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        subtitle="Manage top-level category hierarchy details, banner image, and icons"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Residential Cleaning"
                maxLength={50}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. residential-cleaning"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Category Image Upload Component */}
          <FileUploadInput
            label="Category Banner Image"
            value={image}
            onChange={handleImageChange}
            hint="Upload custom banner image file or select from preset category templates"
            presets={CATEGORY_PRESETS}
          />

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description (Max 250 chars)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary of the cleaning category for frontend customers..."
              rows={2}
              maxLength={250}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Icon Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category Icon Symbol *
              </label>
              <div className="grid grid-cols-5 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setIconName(icon)}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1 transition ${
                      iconName === icon
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    <DynamicIcon name={icon} className="w-4 h-4" />
                    <span className="text-[9px] truncate max-w-full font-medium">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order & Status */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sort Order Index
                </label>
                <input
                  type="number"
                  min={0}
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    Show category on customer booking platform
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{editingCategory ? 'Save Changes' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteCategory(deletingId);
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category? Any linked services will lose their category association."
      />
    </div>
  );
};
