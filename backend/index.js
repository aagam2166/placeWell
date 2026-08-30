import 'dotenv/config';
import express from 'express';
import { router as authRouter, authMiddleware } from './src/routes/Auth.js';
import userRouter from './src/routes/User.js';
import experienceRoutes from './src/routes/Experience.js';
import companyRouter from './src/routes/Company.js';
import topicRouter from './src/routes/Topic.js';
import errorHandler from './src/Middleware/errorHandler.js';

const app = express();

// Global BigInt serialization patch
BigInt.prototype.toJSON = function () {
  return Number(this);
};

// Middlewares
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://frontend-five-ruddy-22.vercel.app',
    'http://localhost:5173',
  ].filter(Boolean);

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(authMiddleware);
app.use(express.json());

// Routes
app.use('/', authRouter);
app.use('/api', userRouter);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/api/companies', companyRouter);
app.use('/api/v1', topicRouter);

// Error Handling
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
