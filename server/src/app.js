import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { API_PREFIX, BODY_SIZE_LIMIT, ENVIRONMENTS } from './constants/app.js';
import { MESSAGES } from './constants/messages.js';
import { errorHandler } from './middleware/error.js';
import { notFound } from './middleware/notFound.js';
import routes from './routes/index.js';
import { ApiError } from './utils/ApiError.js';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (curl, Postman) which send no Origin header.
    if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
    return callback(ApiError.forbidden(MESSAGES.CORS_BLOCKED));
  },
  credentials: true,
};

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: false, limit: BODY_SIZE_LIMIT }));
app.use(mongoSanitize());

if (env.nodeEnv !== ENVIRONMENTS.TEST) {
  app.use(morgan(env.nodeEnv === ENVIRONMENTS.PRODUCTION ? 'combined' : 'dev'));
}

app.use(API_PREFIX, routes);

app.use(notFound);
app.use(errorHandler);

export default app;
