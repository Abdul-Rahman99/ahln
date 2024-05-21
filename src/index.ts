import express, { Express, Request, Response, NextFunction } from 'express';
// import cookieParser from "cookie-parser";
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import mountRoutes from './routes';
import { config } from '../config';
import { errorMiddleware, notFound } from './lib/middlewares/error.middleware';

import { client } from './mqtt.config';
import connectDatabase from './models';

const app: Express = express();

// postgers database connect
connectDatabase();

//  mqtt connect
client;

// Middlewares
app.use(morgan('dev')); // http request logger  middleware
app.use(helmet()); // http security
app.use(
  cors({
    origin: '*', // front end dev
    credentials: true,
  }),
);
app.use(express.json({ limit: '20kb' })); // Parsing JSON, limit to prevent large requests
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

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
// console.log(sanitizedInput);
// Routes
app.use('/uploads', express.static('uploads'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message:
    'Too many accounts created from this IP, please try again after 1 hour',
});

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
