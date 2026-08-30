import 'dotenv/config';
import express from 'express';
import { router as authRouter, authMiddleware } from './src/routes/Auth.js';
import userRouter from './src/routes/User.js';
import experienceRoutes from './src/routes/Experience.js';
import companyRouter from './src/routes/Company.js';
import errorHandler from './src/Middleware/errorHandler.js';

const app = express();

// Global BigInt serialization patch
BigInt.prototype.toJSON = function () {
  return Number(this);
};

// Middlewares
app.use(authMiddleware);
app.use(express.json());

// Routes
app.use('/', authRouter);
app.use('/', userRouter);
app.use('/api/v1/experiences', experienceRoutes);
app.use('/companies', companyRouter);

// Error Handling
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
