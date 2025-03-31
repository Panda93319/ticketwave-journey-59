
import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../index';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

// Validation schema for admin registration
const adminRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  adminSecret: z.string().min(1, 'Admin secret key is required')
});

// Validation schema for admin login
const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Register a new admin
router.post('/register', validateRequest(adminRegisterSchema), async (req, res, next) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    
    // Verify admin secret key
    const expectedSecret = process.env.ADMIN_SECRET_KEY || 'sounduoex_admin_secret';
    if (adminSecret !== expectedSecret) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin user in database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, is_email_verified, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, is_email_verified, is_admin',
      [name, email, hashedPassword, true, true]
    );
    
    const newUser = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET || 'sounduoex_secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isEmailVerified: newUser.is_email_verified,
        isAdmin: newUser.is_admin
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin Login
router.post('/login', validateRequest(adminLoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // Check if user is an admin
    if (!user.is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'sounduoex_secret',
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isEmailVerified: user.is_email_verified,
        isAdmin: user.is_admin
      },
      redirectTo: '/admin/dashboard'
    });
  } catch (error) {
    next(error);
  }
});

// Get all users (admin only)
router.get('/users', authenticate, async (req, res, next) => {
  try {
    // Check if user is an admin
    const userId = req.user?.id;
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Get all users
    const result = await pool.query('SELECT id, name, email, is_email_verified, is_admin, created_at FROM users');
    
    res.status(200).json({
      users: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get all orders (admin only)
router.get('/orders', authenticate, async (req, res, next) => {
  try {
    // Check if user is an admin
    const userId = req.user?.id;
    const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [userId]);
    
    if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    // Get all orders with user details
    const result = await pool.query(`
      SELECT o.id, o.amount, o.payment_type, o.status, o.created_at, 
             u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    res.status(200).json({
      orders: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export default router;
