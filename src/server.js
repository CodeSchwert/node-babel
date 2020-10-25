import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import morgan from 'morgan';
import { connect } from './database';
import Users from './models/userModel';
import exampleRouter from './routers/exampleRouter';
import authRouter from './routers/authRouter';
import marketplacesRouter from './routers/marketplacesRouter';
import errorHandler from './middleware/errorHandler';
import Marketplaces from './models/marketplaceModel';
import authMiddleware from './middleware/authMiddleware';
import sendEmail from './services/emailer';

// import RSA public key
const publicCertPath = path.join(__dirname, './certs/jwtRS256.key.pub');
if (!fs.existsSync(publicCertPath)) {
  throw new Error('Could not find RS256 public key!!!');
}
const publicKey = fs.readFileSync(publicCertPath);

// import RSA private key
const privateCertPath = path.join(__dirname, './certs/jwtRS256.key');
if (!fs.existsSync(privateCertPath)) {
  throw new Error('Could not find RS256 private key!!!');
}
const privateKey = fs.readFileSync(privateCertPath);

// connect to the database with Mongoose
connect();

const PORT = parseInt(process.env.PORT) || 5000;
const server = express();

Sentry.init({
  dsn: "https://4d7eb28d3a3342e6a130f297a2a29458@o466354.ingest.sentry.io/5480583",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app: server }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});
// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
server.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
server.use(Sentry.Handlers.tracingHandler());

server.use(express.json());
server.use(morgan('dev'));

// routers and request handlers
server.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

server.use('/auth', authRouter(Users, privateKey, sendEmail));
server.use('/api', exampleRouter);
server.use(
  '/api/marketplaces',
  authMiddleware(Users, publicKey),
  marketplacesRouter(Router, Marketplaces)
);
server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

// error handling middleware
// The error handler must be before any other error middleware and after all controllers
server.use(Sentry.Handlers.errorHandler());

// custom error handling middleware
server.use(errorHandler);

// Optional fallthrough error handler
server.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
