import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const publicCertPath = path.join(__dirname, '../certs/jwtRS256.key.pub');
if (!fs.existsSync(publicCertPath)) {
  throw new Error('Could not find RS256 public key!!!');
}
const publicKey = fs.readFileSync(publicCertPath);

module.exports = () => {
  const authMiddleware = (req, res, next) => {
    try {
      console.log(req.headers);

      const { authorization } = req.headers;
  
      // 1. check for authorization header
      if (!authorization) {
        return res.status(400).json({ error: 'Authorization header required!' });
      }
      // 2. check the Bearer string format
      if (!authorization.startsWith('Bearer ')) {
        return res.status(400).json({ error: 'Invalid authorization bearer string!' });
      }
  
      // 3. grab the token
      const token = authorization.split(' ')[1];
      // console.log(token);
  
      // 4. verify token
      const payload = jwt.verify(token, publicKey);
      console.log(payload);

      next();
    } catch (e) {
      next(e);
    }
  };

  return authMiddleware;
}
