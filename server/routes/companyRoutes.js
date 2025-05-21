import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import upload from '../config/multer.js';
import { protectCompany } from '../middleware/authMiddleware.js';

import {
  ChangeJobApplicationsStatus,  // <- This is the one causing the error
  changeVisibility,
  getCompanyData,
  loginCompany,
  registerCompany,
  postJob,                         
  getCompanyJobApplicants,        
  getCompanyPostedJobs          
} from '../controllers/companyController.js';




// Setup for ES Modules to access __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



const router = express.Router();

// Register a company with image upload
router.post('/register',upload.single('image'), registerCompany);

// Company login
router.post('/login', loginCompany);

// Get a company data
router.get('/company', protectCompany, getCompanyData);

// Post a job
router.post('/post-job',protectCompany, postJob);

// Get applicants data of company
router.get('/applicants', protectCompany, getCompanyJobApplicants);

// Get company job list
router.get('/list-jobs',protectCompany, getCompanyPostedJobs);

// Change application status
router.post('/change-status', protectCompany, ChangeJobApplicationsStatus);

// Change application visibility
router.post('/change-visibility', protectCompany, changeVisibility);

export default router;
