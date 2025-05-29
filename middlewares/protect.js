const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // بررسی Header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.user = user; // اضافه کردن کاربر به req
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'No token, authorization denied' });
  }
};

module.exports = protect;
