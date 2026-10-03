import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Shield,
  Briefcase,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { CleanerProfile } from '../../types';
import { Modal } from '../common/Modal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { FileUploadInput } from '../common/FileUploadInput';

export const CleanersView: React.FC = () => {
  const { cleaners, addCleaner, updateCleaner, deleteCleaner, activeCity } = useAdmin();

  const [search, setSearch] = useState('');
  const [emirateFilter, setEmirateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCleaner, setEditingCleaner] = useState<CleanerProfile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+971 50 ');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [emirate, setEmirate] = useState<'Dubai' | 'Abu Dhabi' | 'Sharjah'>('Dubai');
  const [currentLocation, setCurrentLocation] = useState('Dubai Marina');
  const [rating, setRating] = useState<number>(5.0);
  const [status, setStatus] = useState<'available' | 'on_job' | 'off_duty' | 'on_leave'>('available');
  const [skills, setSkills] = useState('Deep Cleaning, Sanitization');
  const [formError, setFormError] = useState('');

  const openAddModal = () => {
    setEditingCleaner(null);
    setFullName('');
    setPhone('+971 50 ');
    setEmail('');
    setAvatar('');
    setEmirate(activeCity);
    setCurrentLocation(`${activeCity} Central`);
    setRating(5.0);
    setStatus('available');
    setSkills('Home Cleaning, Deep Cleaning');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (c: CleanerProfile) => {
    setEditingCleaner(c);
    setFullName(c.fullName);
    setPhone(c.phone);
    setEmail(c.email);
    setAvatar(c.avatar);
    setEmirate(c.emirate || 'Dubai');
    setCurrentLocation(c.currentLocation || '');
    setRating(c.rating);
    setStatus(c.status);
    setSkills(c.skills ? c.skills.join(', ') : '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFormError('Cleaner name is required');
      return;
    }
    if (!phone.trim()) {
      setFormError('UAE phone number is required');
      return;
    }

    const skillsArray = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingCleaner) {
      updateCleaner(editingCleaner.id, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@maidslife.ae`,
        avatar,
        emirate,
        currentLocation: (currentLocation || '').trim(),
        rating: Number(rating),
        status,
        skills: skillsArray.length ? skillsArray : ['General Cleaning'],
      });
    } else {
      addCleaner({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@maidslife.ae`,
        avatar,
        emirate,
        currentLocation: (currentLocation || '').trim(),
        rating: Number(rating),
        status,
        skills: skillsArray.length ? skillsArray : ['General Cleaning'],
      });
    }

    setModalOpen(false);
  };

  const getStatusBadge = (st: CleanerProfile['status']) => {
    switch (st) {
      case 'available':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Available
          </span>
        );
      case 'on_job':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            On Job
          </span>
        );
      case 'off_duty':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Off Duty
          </span>
        );
      case 'on_leave':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            On Leave
          </span>
        );
    }
  };

  const filteredCleaners = cleaners.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.currentLocation.toLowerCase().includes(search.toLowerCase());
    const matchesEmirate = emirateFilter === 'all' || c.emirate === emirateFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesEmirate && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cleaners & Staff Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage maid profiles, duty availability, UAE emirate assignments, and performance ratings
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Cleaner</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff name, phone, area..."
                className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <select
              value={emirateFilter}
              onChange={(e) => setEmirateFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Emirates</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="on_job">On Job</option>
              <option value="off_duty">Off Duty</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredCleaners.length} staff members
          </span>
        </div>

        {/* Cleaners Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Staff Member</th>
                <th className="py-3 px-4">UAE Phone</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Current Location</th>
                <th className="py-3 px-4">Jobs Completed</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCleaners.map((cleaner) => (
                <tr key={cleaner.id} className="hover:bg-slate-50/60 transition group">
                  {/* Photo & Name */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={cleaner.avatar}
                        alt={cleaner.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 shadow-2xs"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cleaner.fullName)}&background=random`; }}
                      />
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{cleaner.fullName}</p>
                        <p className="text-[11px] text-slate-400">{cleaner.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cleaner.phone}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800 text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      {cleaner.rating.toFixed(1)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    {getStatusBadge(cleaner.status)}
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span className="font-semibold">{cleaner.currentLocation}</span>
                      <span className="text-[10px] text-slate-400">({cleaner.emirate})</span>
                    </span>
                  </td>

                  {/* Jobs */}
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {cleaner.completedJobs} jobs
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(cleaner)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                        title="Edit Cleaner Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(cleaner.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Cleaner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Cleaner Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCleaner ? 'Edit Cleaner Staff Profile' : 'Add New Cleaner Profile'}
        subtitle="Manage staff details, assigned emirate, and duty availability"
        maxWidth="max-w-xl"
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
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Aisha Khan"
                maxLength={60}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                UAE Phone (WhatsApp) *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971 50 123 4567"
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@maidslife.ae"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Assigned Operating Emirate *
              </label>
              <select
                value={emirate}
                onChange={(e) => setEmirate(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Location
              </label>
              <input
                type="text"
                value={currentLocation}
                onChange={(e) => setCurrentLocation(e.target.value)}
                placeholder="e.g. Dubai Marina"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rating (1.0 - 5.0)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                step={0.1}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duty Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="available">Available</option>
                <option value="on_job">On Job</option>
                <option value="off_duty">Off Duty</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          {/* Avatar File Upload Input */}
          <FileUploadInput
            label="Cleaner Profile Avatar Photo *"
            value={avatar}
            onChange={(url) => setAvatar(url)}
            hint="Click or drag to upload staff profile photo (PNG, JPG, WebP)"
          />

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
              {editingCleaner ? 'Save Changes' : 'Create Profile'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) deleteCleaner(deletingId);
        }}
        title="Remove Cleaner Staff"
        message="Are you sure you want to remove this cleaner profile? They will no longer be available in the dispatch pool."
      />
    </div>
  );
};
