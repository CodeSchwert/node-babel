import fs from 'fs';
import path from 'path';
import express, { Router } from 'express';
import morgan from 'morgan';
import { connect } from './database';
import Users from './models/userModel';
import exampleRouter from './routers/exampleRouter';
import authRouter from './routers/authRouter';
import marketplacesRouter from './routers/marketplacesRouter';
import errorHandler from './middleware/errorHandler';
import Marketplaces from './models/marketplaceModel';
import authMiddleware from './middleware/authMiddleware';

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

server.use(express.json());
server.use(morgan('dev'));
server.use('/auth', authRouter(Users, privateKey));
server.use('/api', exampleRouter);
server.use(
  '/api/marketplaces', 
  authMiddleware(Users, publicKey), 
  marketplacesRouter(Router, Marketplaces)
);

server.use('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
