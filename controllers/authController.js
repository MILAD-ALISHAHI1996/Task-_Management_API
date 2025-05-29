// src/controllers/authController.js
const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    token: generateToken(user.id),
  });
};
