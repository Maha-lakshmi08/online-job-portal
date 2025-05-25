import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // This already loads .env
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import cloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import {clerkMiddleware} from '@clerk/express';
import bodyParser from 'body-parser';
import { requireAuth } from '@clerk/express';


// Initialize Express
const app = express();

// Connect to database
await connectDB();
// await connectCloudinary();

// Middlewares 
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())
app.use('/api/users', userRoutes);


// ✅ Add this to log every request
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });

// Routes
app.get('/', (req, res) => res.send("API Working"));
app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

app.post('/webhooks',clerkWebhooks)
// app.post('/api/webhooks/clerk', bodyParser.raw({ type: 'application/json' }), clerkWebhooks);
app.use('/api/company',companyRoutes)
app.use('/api/jobs', jobRoutes)

app.post('/api/users', (req, res) => {
  console.log('User creation endpoint hit');
  // Your DB user creation logic here
  res.status(201).json({ message: 'User created' });
});

app.use(express.json()); 

// Port
const PORT = process.env.PORT || 5000;

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


