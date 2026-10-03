import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { FileUploadInput } from '../common/FileUploadInput';

export const TeamView: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', experience: '1+ Years Experience', image: '', isActive: true, sortOrder: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateTeamMember(editingId, formData);
    } else {
      await addTeamMember(formData);
    }
    setIsModalOpen(false);
    setFormData({ name: '', role: '', experience: '1+ Years Experience', image: '', isActive: true, sortOrder: 0 });
    setEditingId(null);
  };

  const handleEdit = (member: any) => {
    setFormData({ ...member });
    setEditingId(member.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      await deleteTeamMember(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          onClick={() => { setEditingId(null); setFormData({ name: '', role: '', experience: '1+ Years Experience', image: '', isActive: true, sortOrder: 0 }); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm border border-slate-100 mb-4">
              <img
                src={member.image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'}
                alt={member.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
            <h3 className="font-semibold text-lg">{member.name}</h3>
            <p className="text-sm text-slate-500 font-medium">{member.role}</p>
            <p className="text-xs text-slate-400 mb-4">{member.experience}</p>
            
            <div className="flex justify-between items-center border-t pt-3">
              <span className={`text-xs px-2 py-1 rounded-full ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {member.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="space-x-2">
                <button onClick={() => handleEdit(member)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                <button onClick={() => handleDelete(member.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-bold mb-4 shrink-0">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <div className="overflow-y-auto pr-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience</label>
                  <input required type="text" className="w-full p-2 border rounded-lg" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input type="number" className="w-full p-2 border rounded-lg" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })} />
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                  <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
                </div>
                
                <FileUploadInput
                  label="Profile Image *"
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  hint="Click or drag to upload member image (PNG, JPG, WebP)"
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
