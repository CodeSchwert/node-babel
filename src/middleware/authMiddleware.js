import jwt from 'jsonwebtoken';

export default (Users, publicKey) => {
  const authMiddleware = async (req, res, next) => {
    try {
      const { authorization } = req.headers;
  
      // 1. check for authorization header
      if (!authorization) {
        return res.status(401).json({
          error: 'Authorization header required!'
        });
      }
      // 2. check the Bearer string format
      if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({
          error: 'Invalid authorization bearer string!'
        });
      }
  
      // 3. grab the token
      const token = authorization.split(' ')[1];
  
      // 4. verify token
      const payload = jwt.verify(token, publicKey);

      // 5. check the user exists in the database
      const verifiedUser = await Users.findById(payload.sub, { password: 0 });
      if (!Boolean(verifiedUser)) {
        return res.status(404).json({ error: 'User not found!' });
      }

      // attach user and payload for next request handlers
      req.verifiedUser = verifiedUser;
      req.jwtPayload = payload;

      next();
    } catch (e) {
      next(e);
    }
  };

  return authMiddleware;
}
