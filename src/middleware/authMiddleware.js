import jwt from 'jsonwebtoken';

const checkDateTime = (iat) => {
  const thirtyDays = 30 * 86400000;
  const currentTime = new Date().getTime();
  const iat30days = new Date((iat * 1000) + thirtyDays).getTime();

  return iat30days >= currentTime;
};

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

      // 5. check the token is not too old
      if (!checkDateTime(payload.iat)) {
        return res.status(401).json({ error: 'Authorization token expired!' });
      }

      // 6. check the user exists in the database
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
