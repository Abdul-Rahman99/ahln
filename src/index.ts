import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';

import i18n from './config/i18n';
import mountRoutes from './routes';
import { config } from '../config';
import { errorMiddleware, notFound } from './middlewares/error.middleware';
import { client } from './config/mqtt';
import connectDatabase from './models';
import localizationMiddleware from './middlewares/localization.middleware'; // Adjust import path as needed

const app: Express = express();

// Connect to PostgreSQL database
connectDatabase();

// Connect to MQTT client
client;

// Middlewares
app.use(localizationMiddleware); // Use localization middleware
app.use(i18n.init); // Initialize i18n

app.use(morgan('dev')); // HTTP request logger middleware
app.use(helmet()); // HTTP security headers

app.use(
  cors({
    origin: '*', // needs adjustments for production
    credentials: true,
  }),
);

// Middleware to parse JSON requests
app.use(express.json({ limit: '20kb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
);

app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss())// simplified XSS protection can be applied with customization

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter); // Apply the rate limiting middleware to all API routes for suspecious operations

// Static file serving
app.use('/uploads', express.static('uploads'));

// Mount routes
mountRoutes(app);
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages/index.html'));
});

// 404 Not Found middleware
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: i18n.__('YOU_ARE_LOST'),
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorMiddleware);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Shutting down server...');
    process.exit(1);
  });
});

export default app;
