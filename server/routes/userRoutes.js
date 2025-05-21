import express from 'express'
import { applyForJob, getUserData, getUserJobApplications, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'



const router = express.Router()

//Get user Data
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User Not Found' });
  res.json(user);
});


//Apply for a job
router.post('/apply', applyForJob)

//Get applied jobs data
router.get('/applications', getUserJobApplications)

//Update user profile (resume)
router.post('/update-resume', upload.single('resume'),updateUserResume)

export default router;


