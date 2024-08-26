const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  console.log('Authorization Header:', token);
  if (!token) {
    return res.status(401).json({ message: 'token required' });
  }

  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;


  const secret = process.env.SECRET || 'shh';
  jwt.verify(tokenWithoutBearer, secret, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err)
      return res.status(401).json({ message: 'token invalid' });
    } else {
      console.log('Decoded JWT:', decoded)
      req.decodedJwt = decoded;
      next();
    }
  });
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
