import React, { useState, useEffect, useRef } from 'react';
import {
  CurrencyCircleDollar,
  Briefcase,
  PaperPlaneRight,
  CheckCircle,
  MapPin,
  Check,
  CircleNotch,
  WarningCircle,
  FilePdf,
  UploadSimple,
  X,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { clientApi } from '../services/api';

const M = "'Manrope', sans-serif";
const MAX_CV_SIZE_MB = 5;

interface JobPosition {
  id: string;
  title: string;
  type: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
}

interface CareersPageProps {
  onBookClick?: () => void;
}

const emptyForm = { name: '', email: '', phone: '', experience: '1-3 Years', message: '' };

export const CareersPage: React.FC<CareersPageProps> = () => {
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(true);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [formData, setFormData] = useState(emptyForm);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [appliedJobTitle, setAppliedJobTitle] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoadingJobs(true);
      const fetched = await clientApi.getJobs();
      if (!isMounted) return;
      const normalized: JobPosition[] = (fetched || []).map((j: any) => ({
        id: String(j.id || j._id),
        title: j.title,
        type: j.type || 'Full-Time',
        location: j.location || 'Dubai, UAE',
        salary: j.salary || '',
        description: j.description || '',
        requirements: Array.isArray(j.requirements) ? j.requirements : [],
      }));
      setJobs(normalized);
      if (normalized.length > 0) setSelectedJobId(normalized[0].id);
      setLoadingJobs(false);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const validateAndSetCv = (file: File | undefined | null) => {
    setCvError(null);
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setCvFile(null);
      setCvError('Only PDF files are accepted. Please upload your CV as a .pdf');
      return;
    }
    if (file.size > MAX_CV_SIZE_MB * 1024 * 1024) {
      setCvFile(null);
      setCvError(`File is too large. Maximum size is ${MAX_CV_SIZE_MB} MB.`);
      return;
    }
    setCvFile(file);
  };

  const clearCv = () => {
    setCvFile(null);
    setCvError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedJobId) {
      setSubmitError('Please select a position to apply for.');
      return;
    }
    if (!cvFile) {
      setCvError('Please attach your CV (PDF) to continue.');
      return;
    }

    setIsSubmitting(true);
    const res = await clientApi.submitJobApplication({
      jobId: selectedJobId,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      experience: formData.experience,
      message: formData.message.trim(),
      cv: cvFile,
    });
    setIsSubmitting(false);

    if (res.success) {
      const title = jobs.find((j) => j.id === selectedJobId)?.title || 'the position';
      setAppliedJobTitle(title);
      setFormData(emptyForm);
      clearCv();
      setTimeout(() => setAppliedJobTitle(null), 6000);
    } else {
      setSubmitError(res.message || 'Failed to submit application. Please try again.');
    }
  };

  const inputCls =
    'w-full rounded-2xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#0C3352] outline-none focus:border-[#0084FF] focus:bg-white transition-all';
  const labelCls = 'block text-xs font-bold text-[#0C3352] uppercase tracking-wider mb-2';

  return (
    <div className="w-full bg-white min-h-screen pt-[130px]">
      {/* ── 1. TOP HEADER BANNER ── */}
      <div className="w-full bg-white pt-10 pb-14 px-6 sm:px-12 text-center border-b border-slate-100">
        <div className="mx-auto max-w-[800px]">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-[#E8F3FF] px-4 py-1.5 text-[#0C3352] tracking-wider uppercase mb-4"
            style={{ fontFamily: M, fontSize: '11px', fontWeight: 700, lineHeight: '18px' }}
          >
            <span className="opacity-70">—</span>
            CAREERS AT MAIDSLIFE
            <span className="opacity-70">—</span>
          </div>

          <h1 className="text-[#0C3352]" style={{ fontFamily: M, fontWeight: 800 }}>
            Build a Rewarding Career
            <br />
            <span className="text-[#0084FF]">with Maidslife Dubai</span>
          </h1>

          <p
            className="mt-4 text-[#5A6E7F]"
            style={{ fontFamily: M, fontSize: '16px', fontWeight: 400, lineHeight: '26px' }}
          >
            Join Dubai&apos;s leading home services company. We treat our team members like family — offering 100%
            legal visa sponsorship, market-leading salaries, free accommodation, and clear career growth.
          </p>
        </div>
      </div>

      {/* ── 2. OPEN POSITIONS LISTING ── */}
      <section className="w-full bg-[#F8FAFC] py-20 px-6 sm:px-12 border-b border-slate-100">
        <div className="mx-auto max-w-[1280px]">
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <span
              className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
              style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
            >
              WE ARE HIRING
            </span>
            <h2 className="mt-3 text-[#0C3352]" style={{ fontFamily: M, fontWeight: 800 }}>
              Current Job Openings in Dubai
            </h2>
          </div>

          {loadingJobs ? (
            <div className="space-y-6">
              {[0, 1].map((i) => (
                <div key={i} className="bg-white rounded-[24px] border border-[#DCEBF8] p-8 animate-pulse">
                  <div className="h-5 w-48 bg-slate-100 rounded-full" />
                  <div className="h-7 w-80 bg-slate-100 rounded-lg mt-4" />
                  <div className="h-4 w-full max-w-[600px] bg-slate-100 rounded mt-4" />
                  <div className="h-4 w-full max-w-[450px] bg-slate-100 rounded mt-2" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-[24px] border border-dashed border-[#B5D8F8] p-12 text-center max-w-[640px] mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#E8F3FF] text-[#0084FF] flex items-center justify-center mx-auto">
                <MagnifyingGlass size={28} weight="bold" />
              </div>
              <h3 className="mt-4 text-[#0C3352]" style={{ fontFamily: M, fontWeight: 800 }}>
                No open positions right now
              </h3>
              <p className="mt-2 text-[#5A6E7F]" style={{ fontFamily: M, fontSize: '14px', lineHeight: '22px' }}>
                We&apos;re not actively hiring at the moment. Please check back soon — new roles are posted regularly.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-[24px] border border-[#DCEBF8] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,132,255,0.08)] hover:border-[#B5D8F8] transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="max-w-[700px]">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-[#E8F3FF] px-3 py-1 text-xs font-bold text-[#0084FF]"
                        style={{ fontFamily: M }}
                      >
                        <Briefcase size={13} weight="bold" /> {job.type}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#5A6E7F]"
                        style={{ fontFamily: M }}
                      >
                        <MapPin size={14} weight="bold" className="text-[#0084FF]" /> {job.location}
                      </span>
                      {job.salary && (
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#0C3352] bg-slate-100 px-3 py-1 rounded-full"
                          style={{ fontFamily: M }}
                        >
                          <CurrencyCircleDollar size={14} weight="bold" className="text-emerald-600" /> {job.salary}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-[#0C3352]" style={{ fontFamily: M, fontWeight: 800 }}>
                      {job.title}
                    </h3>

                    <p
                      className="mt-2 text-[#5A6E7F]"
                      style={{ fontFamily: M, fontSize: '14px', lineHeight: '22px' }}
                    >
                      {job.description}
                    </p>

                    {job.requirements.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {job.requirements.map((req, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2">
                            <Check size={14} weight="bold" className="text-[#0084FF] shrink-0 mt-0.5" />
                            <span style={{ fontFamily: M, fontSize: '12px', color: '#0C3352', fontWeight: 600 }}>
                              {req}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center">
                    <button
                      onClick={() => {
                        setSelectedJobId(job.id);
                        document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0C3352] hover:bg-[#0084FF] text-white px-7 py-3.5 text-sm font-bold transition-all duration-300 shadow-md focus:outline-none"
                      style={{ fontFamily: M }}
                    >
                      Apply Now
                      <PaperPlaneRight size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. APPLICATION FORM ── (only when there are open jobs) */}
      {!loadingJobs && jobs.length > 0 && (
        <section id="apply-form" className="w-full bg-white py-20 px-4 sm:px-12">
          <div className="mx-auto max-w-[900px] bg-white rounded-[28px] border border-[#DCEBF8] p-6 sm:p-12 shadow-[0_6px_24px_rgba(12,51,82,0.04)]">
            <div className="text-center max-w-[600px] mx-auto mb-8">
              <span
                className="text-[#0084FF] uppercase tracking-[0.15em] font-extrabold"
                style={{ fontFamily: M, fontSize: '11px', lineHeight: '18px' }}
              >
                SUBMIT YOUR APPLICATION
              </span>
              <h2 className="mt-2 text-[#0C3352]" style={{ fontFamily: M, fontWeight: 800 }}>
                Apply for a Position
              </h2>
              <p className="mt-2 text-[#5A6E7F]" style={{ fontFamily: M, fontSize: '14px' }}>
                Fill out your details, attach your CV (PDF) and our HR team will contact you within 24 hours.
              </p>
            </div>

            {submitError && (
              <div
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm font-semibold"
                style={{ fontFamily: M }}
              >
                <WarningCircle size={20} weight="bold" className="shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {appliedJobTitle ? (
              <div className="p-8 rounded-2xl bg-[#EBF5FF] border border-[#CCE3FF] text-[#0066CC] text-center space-y-2">
                <CheckCircle size={36} weight="fill" className="mx-auto" />
                <h4 className="font-bold text-lg" style={{ fontFamily: M }}>
                  Application Submitted Successfully!
                </h4>
                <p className="text-sm opacity-90 max-w-[500px] mx-auto" style={{ fontFamily: M }}>
                  Thank you for applying for <span className="font-bold">{appliedJobTitle}</span>. Our recruitment
                  team in Dubai will review your CV and reach out to you via WhatsApp or call.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-6" noValidate={false}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Position */}
                  <div className="sm:col-span-2">
                    <label className={labelCls} style={{ fontFamily: M }}>
                      Applying For Position *
                    </label>
                    <select
                      required
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className={`${inputCls} font-bold cursor-pointer`}
                      style={{ fontFamily: M }}
                    >
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title}
                          {j.salary ? ` (${j.salary})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className={labelCls} style={{ fontFamily: M }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Maria Santos"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputCls}
                      style={{ fontFamily: M }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelCls} style={{ fontFamily: M }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      maxLength={120}
                      placeholder="e.g. maria@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputCls}
                      style={{ fontFamily: M }}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelCls} style={{ fontFamily: M }}>
                      Phone / WhatsApp Number *
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-xs font-bold text-slate-500" style={{ fontFamily: M }}>
                        +971
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={20}
                        placeholder="50 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`${inputCls} pl-16`}
                        style={{ fontFamily: M }}
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className={labelCls} style={{ fontFamily: M }}>
                      Cleaning Experience *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className={`${inputCls} cursor-pointer`}
                      style={{ fontFamily: M }}
                    >
                      <option>Less than 1 Year</option>
                      <option>1-3 Years</option>
                      <option>3-5 Years</option>
                      <option>5+ Years Experience</option>
                    </select>
                  </div>
                </div>

                {/* CV Upload (PDF, required) */}
                <div>
                  <label className={labelCls} style={{ fontFamily: M }}>
                    Upload Your CV (PDF) *
                  </label>

                  <input
                    ref={fileInputRef}
                    id="cv-upload-input"
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => validateAndSetCv(e.target.files?.[0])}
                  />

                  {cvFile ? (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#B5D8F8] bg-[#F3F9FF] px-4 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                          <FilePdf size={22} weight="fill" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-sm font-bold text-[#0C3352] truncate"
                            style={{ fontFamily: M }}
                            title={cvFile.name}
                          >
                            {cvFile.name}
                          </p>
                          <p className="text-xs text-[#5A6E7F]" style={{ fontFamily: M }}>
                            {(cvFile.size / 1024 / 1024).toFixed(2)} MB · PDF
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCv}
                        className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                        aria-label="Remove CV"
                      >
                        <X size={16} weight="bold" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        validateAndSetCv(e.dataTransfer.files?.[0]);
                      }}
                      className={`w-full rounded-2xl border-2 border-dashed px-4 py-8 flex flex-col items-center justify-center gap-2 transition-all ${
                        isDragging
                          ? 'border-[#0084FF] bg-[#E8F3FF]'
                          : cvError
                          ? 'border-red-300 bg-red-50/40'
                          : 'border-slate-200 bg-[#F8FAFC] hover:border-[#0084FF] hover:bg-[#F3F9FF]'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-full bg-white border border-[#DCEBF8] text-[#0084FF] flex items-center justify-center shadow-sm">
                        <UploadSimple size={20} weight="bold" />
                      </div>
                      <span className="text-sm font-bold text-[#0C3352]" style={{ fontFamily: M }}>
                        Click to upload or drag &amp; drop
                      </span>
                      <span className="text-xs text-[#5A6E7F]" style={{ fontFamily: M }}>
                        PDF only · Max {MAX_CV_SIZE_MB} MB
                      </span>
                    </button>
                  )}

                  {cvError && (
                    <p
                      className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5"
                      style={{ fontFamily: M }}
                    >
                      <WarningCircle size={14} weight="bold" /> {cvError}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className={labelCls} style={{ fontFamily: M }}>
                    Tell Us About Yourself &amp; Previous Work Experience
                  </label>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    placeholder="Share details about your previous cleaning jobs in Dubai or home country..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={inputCls}
                    style={{ fontFamily: M }}
                  />
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#0C3352] hover:bg-[#0084FF] disabled:opacity-50 disabled:cursor-not-allowed px-10 py-4 text-white font-extrabold text-sm transition-all duration-300 shadow-md focus:outline-none"
                    style={{ fontFamily: M }}
                  >
                    {isSubmitting ? (
                      <>
                        <CircleNotch size={18} weight="bold" className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <PaperPlaneRight size={18} weight="bold" />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default CareersPage;
