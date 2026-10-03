import fs from 'fs';
import path from 'path';
import { Job } from './job.model.js';
import { JobApplication } from './jobApplication.model.js';
import { CV_UPLOAD_DIR } from '../../middlewares/cvUpload.middleware.js';

const removeCvFile = (cvFile) => {
  if (!cvFile) return;
  // basename() prevents path traversal
  const filePath = path.join(CV_UPLOAD_DIR, path.basename(cvFile));
  fs.unlink(filePath, () => {});
};

/**
 * Public: Get all active job postings
 */
export const getActiveJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Get all jobs (active & inactive)
 */
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Create a new job opening
 */
export const createJob = async (req, res, next) => {
  try {
    const job = await Job.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update a job posting
 */
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete a job posting
 */
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public: Submit job application (with PDF CV File Upload)
 */
export const submitApplication = async (req, res, next) => {
  try {
    const { jobId, name, applicantName, email, phone, experience, message } = req.body;

    // Application must target a real, active job opening
    const job = jobId && /^[a-f\d]{24}$/i.test(jobId) ? await Job.findById(jobId) : null;
    if (!job || !job.isActive) {
      removeCvFile(req.file?.filename);
      return res.status(400).json({ success: false, message: 'This job opening is no longer available.' });
    }

    const application = await JobApplication.create({
      jobId: job._id,
      jobTitle: job.title,
      applicantName: name || applicantName,
      email,
      phone,
      experience: experience || '1-3 Years',
      cvFile: req.file.filename,
      cvOriginalName: req.file.originalname,
      message: message || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Job application & CV submitted successfully',
      data: { id: application.id },
    });
  } catch (error) {
    removeCvFile(req.file?.filename);
    next(error);
  }
};

/**
 * Admin: Get all job applications
 */
export const getApplications = async (req, res, next) => {
  try {
    const applications = await JobApplication.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Update job application status / notes
 */
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes);

    const application = await JobApplication.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Delete single job application
 */
export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await JobApplication.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    removeCvFile(application.cvFile);
    return res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: Stream an applicant's CV PDF (authenticated only)
 */
export const downloadCv = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application || !application.cvFile) {
      return res.status(404).json({ success: false, message: 'CV not found' });
    }

    const filePath = path.join(CV_UPLOAD_DIR, path.basename(application.cvFile));
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'CV file missing on server' });
    }

    const safeName = `${application.applicantName.replace(/[^a-z0-9]+/gi, '_')}_CV.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    res.setHeader('Cache-Control', 'private, no-store');
    return res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};
