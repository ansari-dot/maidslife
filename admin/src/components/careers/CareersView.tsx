import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  DollarSign,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MessageSquare,
  X,
  ExternalLink,
  ChevronDown,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { JobPosting, JobApplication } from '../../types';
import { apiService } from '../../services/apiService';
import { useAdmin } from '../../context/AdminContext';

export const CareersView: React.FC = () => {
  const { showToast: addToast } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<'jobs' | 'applications'>('applications');
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Job Modal State
  const [showJobModal, setShowJobModal] = useState<boolean>(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: 'Housekeeping & Operations',
    type: 'Full-Time',
    location: 'Dubai, UAE',
    salary: '',
    description: '',
    requirements: '',
    isActive: true,
  });

  // Application Details Modal / Notes State
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');
  const [openingCvId, setOpeningCvId] = useState<string | null>(null);

  // CVs are private on the server: fetch with auth cookies and open as a blob URL
  const handleViewCv = async (app: JobApplication) => {
    if (!app.cvFile) {
      addToast('No CV attached to this application', 'warning');
      return;
    }
    // Open the tab synchronously so popup blockers allow it
    const win = window.open('', '_blank');
    try {
      setOpeningCvId(app.id);
      const blob = await apiService.getApplicationCvBlob(app.id);
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      if (win) {
        win.location.href = url;
      } else {
        window.open(url, '_blank');
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err: any) {
      win?.close();
      addToast(err.message || 'Failed to open CV', 'error');
    } finally {
      setOpeningCvId(null);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedJobs, fetchedApps] = await Promise.all([
        apiService.getJobs(),
        apiService.getJobApplications(),
      ]);
      setJobs(fetchedJobs);
      setApplications(fetchedApps);
    } catch (err: any) {
      addToast('Error loading Careers data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Job CRUD operations
  const handleOpenJobModal = (job?: JobPosting) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        department: job.department || 'Housekeeping & Operations',
        type: job.type || 'Full-Time',
        location: job.location || 'Dubai, UAE',
        salary: job.salary,
        description: job.description,
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
        isActive: job.isActive ?? true,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        department: 'Housekeeping & Operations',
        type: 'Full-Time',
        location: 'Dubai, UAE',
        salary: 'AED 3,000 – AED 4,500 / month',
        description: '',
        requirements: '',
        isActive: true,
      });
    }
    setShowJobModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requirementsArr = jobFormData.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      const payload = {
        title: jobFormData.title,
        department: jobFormData.department,
        type: jobFormData.type,
        location: jobFormData.location,
        salary: jobFormData.salary,
        description: jobFormData.description,
        requirements: requirementsArr,
        isActive: jobFormData.isActive,
        order: editingJob ? editingJob.order : jobs.length + 1,
      };

      if (editingJob) {
        await apiService.updateJob(editingJob.id, payload);
        addToast('Job posting updated successfully', 'success');
      } else {
        await apiService.createJob(payload);
        addToast('Job posting created successfully', 'success');
      }
      setShowJobModal(false);
      loadData();
    } catch (err: any) {
      addToast('Failed to save job posting: ' + err.message, 'error');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await apiService.deleteJob(id);
      addToast('Job posting deleted', 'info');
      loadData();
    } catch (err: any) {
      addToast('Failed to delete job: ' + err.message, 'error');
    }
  };

  const handleToggleJobStatus = async (job: JobPosting) => {
    try {
      await apiService.updateJob(job.id, { isActive: !job.isActive });
      addToast(`Job ${!job.isActive ? 'activated' : 'deactivated'}`, 'success');
      loadData();
    } catch (err: any) {
      addToast('Failed to toggle job status', 'error');
    }
  };

  // Application Operations
  const handleUpdateAppStatus = async (id: string, newStatus: JobApplication['status']) => {
    try {
      await apiService.updateJobApplication(id, { status: newStatus });
      addToast(`Application status updated to ${newStatus}`, 'success');
      loadData();
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      addToast('Failed to update application status: ' + err.message, 'error');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      await apiService.updateJobApplication(selectedApp.id, { notes: notesInput });
      addToast('Application notes updated', 'success');
      loadData();
      setSelectedApp((prev) => (prev ? { ...prev, notes: notesInput } : null));
    } catch (err: any) {
      addToast('Failed to save notes: ' + err.message, 'error');
    }
  };

  const handleDeleteApp = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job application?')) return;
    try {
      await apiService.deleteJobApplication(id);
      addToast('Application deleted', 'info');
      if (selectedApp?.id === id) setSelectedApp(null);
      loadData();
    } catch (err: any) {
      addToast('Failed to delete application', 'error');
    }
  };

  // Filtered Applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeJobsCount = jobs.filter((j) => j.isActive).length;
  const pendingAppsCount = applications.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Top Title & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-sky-600" />
            Careers & Recruitment Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage active job openings, review candidate applications, and track recruitment progress.
          </p>
        </div>

        <button
          onClick={() => handleOpenJobModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Job Opening
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Openings</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{jobs.length}</h3>
            <p className="text-xs text-sky-600 font-medium mt-1">{activeJobsCount} active on website</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applications</p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{applications.length}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Candidates applied</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingAppsCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Requires HR attention</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hired Staff</p>
            <h3 className="text-2xl font-extrabold text-purple-600 mt-1">
              {applications.filter((a) => a.status === 'hired').length}
            </h3>
            <p className="text-xs text-purple-600 font-medium mt-1">Recruitment conversions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 space-x-6">
        <button
          onClick={() => setActiveSubTab('applications')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeSubTab === 'applications'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Job Applications ({applications.length})
          {pendingAppsCount > 0 && (
            <span className="ml-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {pendingAppsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('jobs')}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeSubTab === 'jobs'
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Job Openings ({jobs.length})
        </button>
      </div>

      {/* ── TAB 1: JOB APPLICATIONS ── */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {/* Controls: Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search candidate name, email, job..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-sky-500 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs px-3 py-2 outline-none font-semibold text-slate-700 focus:border-sky-500 cursor-pointer"
              >
                <option value="all">All Statuses ({applications.length})</option>
                <option value="pending">Pending ({applications.filter((a) => a.status === 'pending').length})</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Applicant Candidate</th>
                    <th className="px-6 py-4">Target Job Opening</th>
                    <th className="px-6 py-4">Experience</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Loading applications data...
                      </td>
                    </tr>
                  ) : filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        No applications found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{app.applicantName}</div>
                          <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {app.email}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-600">
                              <Phone className="w-3 h-3 text-sky-600" /> {app.phone}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-slate-800 bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-100">
                            {app.jobTitle}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-semibold text-slate-700">{app.experience}</td>

                        <td className="px-6 py-4 text-slate-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              handleUpdateAppStatus(app.id, e.target.value as JobApplication['status'])
                            }
                            className={`text-xs font-bold rounded-lg px-2.5 py-1 outline-none cursor-pointer border ${
                              app.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : app.status === 'reviewed'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : app.status === 'interviewed'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : app.status === 'hired'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="hired">Hired</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View CV (PDF) */}
                            <button
                              onClick={() => handleViewCv(app)}
                              disabled={!app.cvFile || openingCvId === app.id}
                              title={app.cvFile ? 'View CV (PDF)' : 'No CV attached'}
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed transition text-[11px] font-bold"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              {openingCvId === app.id ? '...' : 'CV'}
                            </button>
                            {/* WhatsApp Direct Link */}
                            <a
                              href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            {/* Details & Notes */}
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setNotesInput(app.notes || '');
                              }}
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 transition"
                              title="View Details & Notes"
                            >
                              <FileText className="w-4 h-4" />
                            </button>

                            {/* Delete Application */}
                            <button
                              onClick={() => handleDeleteApp(app.id)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
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
        </div>
      )}

      {/* ── TAB 2: JOB OPENINGS ── */}
      {activeSubTab === 'jobs' && !loading && jobs.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="mt-3 text-sm font-bold text-slate-900">No job openings yet</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create your first job opening — it will appear instantly on the website Careers page.
          </p>
          <button
            onClick={() => handleOpenJobModal()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Create Job Opening
          </button>
        </div>
      )}

      {activeSubTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition ${
                job.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-100">
                      {job.type}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{job.title}</h3>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-sky-600" /> {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleJobStatus(job)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border transition ${
                      job.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {job.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">{job.description}</p>

                {job.requirements && job.requirements.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Requirements:</p>
                    <ul className="text-xs text-slate-600 space-y-0.5 list-disc pl-4">
                      {job.requirements.slice(0, 3).map((req, rIdx) => (
                        <li key={rIdx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-6">
                <span className="text-xs text-slate-400 font-medium">
                  {applications.filter((a) => a.jobTitle === job.title).length} Candidates Applied
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenJobModal(job)}
                    className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                    title="Edit Job"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CREATE / EDIT JOB MODAL ── */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingJob ? 'Edit Job Opening' : 'Create New Job Opening'}
              </h2>
              <button onClick={() => setShowJobModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Deep Cleaning Specialist"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Job Type</label>
                  <select
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Salary Offer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AED 3,000 – AED 4,500 / month"
                    value={jobFormData.salary}
                    onChange={(e) => setJobFormData({ ...jobFormData, salary: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe job responsibilities and scope..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">Requirements (One bullet point per line)</label>
                <textarea
                  rows={4}
                  placeholder="2+ years experience in Dubai&#10;Basic English communication&#10;Company visa provided"
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={jobFormData.isActive}
                  onChange={(e) => setJobFormData({ ...jobFormData, isActive: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <label htmlFor="isActiveCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Active (Displayed publicly on Careers page)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Save Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CANDIDATE APPLICATION DETAILS & NOTES MODAL ── */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedApp.applicantName}</h2>
                <p className="text-xs text-sky-600 font-semibold">Applied for {selectedApp.jobTitle}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Phone / WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-sky-600 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    {selectedApp.phone}
                  </a>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                  <a href={`mailto:${selectedApp.email}`} className="font-semibold text-slate-800 hover:underline block mt-0.5">
                    {selectedApp.email}
                  </a>
                </div>

                <div className="mt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Experience</span>
                  <span className="font-bold text-slate-900">{selectedApp.experience}</span>
                </div>

                <div className="mt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Application Status</span>
                  <span className="font-bold uppercase tracking-wider text-sky-700">{selectedApp.status}</span>
                </div>
              </div>

              {selectedApp.cvFile && (
                <button
                  onClick={() => handleViewCv(selectedApp)}
                  disabled={openingCvId === selectedApp.id}
                  className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border border-red-100 bg-red-50/60 hover:bg-red-50 transition text-left disabled:opacity-60"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-white border border-red-100 text-red-500 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-bold text-slate-900 truncate">
                        {selectedApp.cvOriginalName || 'Candidate CV.pdf'}
                      </span>
                      <span className="block text-[11px] text-slate-500">PDF document</span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 shrink-0">
                    {openingCvId === selectedApp.id ? 'Opening...' : 'View CV'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </button>
              )}

              {selectedApp.message && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Candidate Bio / Statement
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-slate-800 font-medium leading-relaxed">
                    {selectedApp.message}
                  </div>
                </div>
              )}

              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  HR Internal Notes
                </span>
                <textarea
                  rows={3}
                  placeholder="Add interview notes, passport status, visa eligibility..."
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-sky-500 focus:bg-white text-xs font-medium"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/${selectedApp.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Contact via WhatsApp
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersView;
