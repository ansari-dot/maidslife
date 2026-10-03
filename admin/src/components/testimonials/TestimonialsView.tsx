import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FileUploadInput } from '../common/FileUploadInput';

export const TestimonialsView: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: 'Customer', content: '', rating: 5, avatar: '', isActive: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateTestimonial(editingId, formData);
    } else {
      await addTestimonial(formData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', role: 'Customer', content: '', rating: 5, avatar: '', isActive: true });
    setEditingId(null);
  };

  const handleEdit = (test: any) => {
    setFormData({ ...test });
    setEditingId(test.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await deleteTestimonial(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <button
          onClick={() => { setEditingId(null); setFormData({ name: '', role: 'Customer', content: '', rating: 5, avatar: '', isActive: true }); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                {test.avatar ? <img src={test.avatar} alt={test.name} className="w-full h-full object-cover" /> : <span className="text-slate-500 font-bold">{test.name.charAt(0)}</span>}
              </div>
              <div>
                <h3 className="font-semibold">{test.name}</h3>
                <p className="text-sm text-slate-500">{test.role}</p>
              </div>
            </div>
            <p className="text-slate-700 mb-4 text-sm italic">"{test.content}"</p>
            <div className="flex justify-between items-center">
              <div className="text-yellow-500 text-sm">{'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}</div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(test)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4 shrink-0">{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <div className="overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Author Name</label>
                <input required type="text" className="w-full p-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input required type="text" className="w-full p-2 border rounded-lg" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea required className="w-full p-2 border rounded-lg" rows={3} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <input required type="number" min="1" max="5" className="w-full p-2 border rounded-lg" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} />
              </div>
              
              <FileUploadInput
                label="Customer Avatar *"
                value={formData.avatar}
                onChange={(url) => setFormData({ ...formData, avatar: url })}
                hint="Click or drag to upload customer avatar (PNG, JPG, WebP)"
              />

              <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0">Save</button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
