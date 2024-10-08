/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
// import path from 'path';
import dotenv from 'dotenv';
import i18n from './config/i18n';
import mountRoutes from './routes';
import { config } from '../config';
import { errorMiddleware } from './middlewares/error.middleware';
import { client } from './config/mqtt';
import connectDatabase from './models';
import localizationMiddleware from './middlewares/localization.middleware'; // Adjust import path as needed
import path from 'path';
import ResponseHandler from './utils/responsesHandler';
// import db from './config/database';

// import patchDatabase from './config/patch';
dotenv.config({ path: '../.env' });

const app: Express = express();

// Connect to PostgreSQL database
connectDatabase();

// PATCHING DATABASE IF NEEDED
// patchDatabase().catch((err) =>
//   console.error('Error in patching function:', err),
// );

// Connect to MQTT client
client;

// Middlewares
app.use(localizationMiddleware); // Use localization middleware
app.use(i18n.init); // Initialize i18n

app.use(morgan('dev')); // HTTP request logger middleware
// app.use(morgan('prod')); // HTTP request logger middleware
app.use(helmet()); // HTTP security headers

app.use(
  cors({
    origin: ['http://localhost:3000'], // needs adjustments for production
    credentials: true,
  }),
);

// Middleware to parse JSON requests
app.use(express.json());
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
);

app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(xss())// simplified XSS protection can be applied with customization

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api', limiter); // Apply the rate limiting middleware to all API routes for suspecious operations

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(config.UPLOADS)));

// async function get_box_ids() {
//   // const connection = db.connect();
//   try {
//     const sql = `SELECT id FROM box`;
//     const result = db.query(sql);
//     return result;
//   } catch (error) {
//     throw new Error((error as Error).message);
//   }
// }

// get_box_ids()
//   .then((result: any) => {
//     // console.log(result.rows);
//     // console.log(result)
//     result.rows.forEach((row: { id: string }) => {
//       app.use(
//         express.static(path.join(__dirname, `../uploads/playback/${row.id}`)),
//       );
//     });
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// Mount routes
mountRoutes(app);

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'pages/index.html'));
// });

// 404 Not Found middleware
app.use((_req: Request, res: Response) => {
  ResponseHandler.badRequest(res, i18n.__('YOU_ARE_LOST'));
});

// Error handling middleware
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
