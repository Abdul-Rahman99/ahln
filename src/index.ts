import express, { Express, Request, Response, NextFunction } from 'express';
// import cookieParser from "cookie-parser";
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';

import localizationMiddleware from './middlewares/localization.middleware'; // Adjust import path as needed
import i18n from './config/i18n';
import mountRoutes from './routes';
import { config } from '../config';
import { errorMiddleware, notFound } from './middlewares/error.middleware';

import { client } from './config/mqtt';
import connectDatabase from './models';

const app: Express = express();

// postgers database connect
connectDatabase();

//  mqtt connect
client;

// Middlewares
app.use(localizationMiddleware); // use localization middleware
app.use(i18n.init); // initialize i18n

app.use(morgan('dev')); // http request logger  middleware
app.use(helmet()); // http security
app.use(
  cors({
    origin: ['*'], // frontend dev
    credentials: true,
  }),
);
app.use(bodyParser.json()); // Middleware to parse JSON requests
app.use(express.json({ limit: '20kb' })); // limit to prevent large requests
// app.use(
//   bodyParser.urlencoded({
//     limit: '50mb',
//     extended: true,
//     parameterLimit: 50000,
//   }),
// );

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use(mongoSanitize()); // no sql query injection

// no harming scripting
// Apply XSS sanitization to user input dynamically within route handlers
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key of Object.keys(req.body)) {
      req.body[key] = xss(req.body[key]);
    }
  }
  next();
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message:
    'Too many accounts created from this IP, please try again after 1 hour',
});

// Routes
app.use('/uploads', express.static('uploads'));

// Apply the rate limiting middleware to all requests.
app.use('/api', limiter);

mountRoutes(app);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'You Are Lost, Review the Docs for the api again!!',
  });
});

app.use(notFound);
app.use(errorMiddleware);

// server connection
const PORT = config.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`App is Running on Port ${PORT}`);
});

// Handling rejection outside Express
process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Shutting Down Server......');
    process.exit(1);
  });
});

export default app;
