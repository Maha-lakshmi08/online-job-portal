import Company from '../models/Company.js'; 
import { v2 as cloudinary } from 'cloudinary';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcrypt';
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";



// Register a new company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;
  const imageFile = req.file;

  if (!name || !email || !password || !imageFile) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      return res.json({ success: false, message: 'Company already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url
    });

    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Company login
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    // Check if company was found
    if (!company) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    // If everything is okay, send back the token and company info
    res.json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image
      },
      token: generateToken(company._id)
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get company data
export const getCompanyData = async (req, res) => {
  
  try {

    const company = req.company

    res.json({success:true, company})
    
  } catch (error) {
    
    res.json({
      success:false,message:error.message
    })
    
  }
};

// Post a new job
export const postJob = async (req, res) => {
  
  const { title, description, location, salary, level, category} = req.body

  const companyId = req.company._id

  try {
    
    const newJob = new Job({
      title,
      description,
      location,
      salary,
      companyId,
      date: Date.now(),
      level,
      category
    })

    await newJob.save()

    res.json({success:true, newJob})
  } catch (error) {
    res.json({success:false, message: error.message})
    
  }

  

  
};

// Get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
  res.json({ success: true, message: "Get job applicants (to be implemented)" });
};

// Get Company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
  try {

    const companyId = req.company._id

    const jobs = await Job.find({companyId})

    //Adding No. of applications info in data
    const jobsData = await Promise.all(jobs.map(async (job) => {
      const applicants = await JobApplication.find({ jobId: job._id });
      return {...job.toObject(),applicants:applicants.length}
    }))



    res.json({ success: true, jobs: jobsData })

    
  } catch (error) {
    res.json ({ success:false, message: error.message})
    
  }
};

// Change job application status
export const ChangeJobApplicationsStatus = async (req, res) => {
  try {
    const { applicationId, newStatus } = req.body;

    if (!applicationId || !newStatus) {
      return res.status(400).json({ success: false, message: "Missing applicationId or newStatus" });
    }

    // Placeholder logic: replace with real Application model logic
    res.json({ success: true, message: "Application status updated successfully (placeholder)" });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change job visibility
export const changeVisibility = async (req, res) => {
  try {

    const {id} = req.body

    const companyId = req.company._id

    const job = await Job.findById(id)

    if (companyId.toString() === job.companyId.toString()) {
      job.visible = !job.visible
      
    }
    
    await job.save()

    res.json({success:true, job})


    
  } catch (error) {
    res.json({success:false, message:error.message})
    
  }
};


