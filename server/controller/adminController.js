const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); // adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_secure_secret';
const SALT_ROUNDS = 10;

const adminController = {
  // Create admin
  create: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      const admin = new Admin({ email: email.toLowerCase(), password: hashed });
      await admin.save();
      const safe = { id: admin._id, email: admin.email };
      res.status(201).json(safe);
    } catch (err) {
      console.error(err);
      if (err.code === 11000) return res.status(409).json({ message: 'Email already in use' });
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },
  // Create admin

  // Get all admins
  getAll: async (req, res) => {
    try {
      const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
      res.json(admins);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // Get single admin by id
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      // fetch admin including password field but DO NOT send the hash back
      const admin = await Admin.findById(id);
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      // Return only safe information. Never send password hash to client.
      const safe = {
        id: admin._id,
        email: admin.email,
        hasPassword: !!admin.password,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };
      res.json(safe);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // Update admin (email and/or password)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = {};

      // If changing password, require currentPassword and verify it
      if (req.body.password) {
        const { currentPassword } = req.body;
        if (!currentPassword) return res.status(400).json({ message: 'Current password required to change password' });

        const existing = await Admin.findById(id).select('+password');
        if (!existing) return res.status(404).json({ message: 'Admin not found' });

        const match = await bcrypt.compare(currentPassword, existing.password);
        if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

        updates.password = await bcrypt.hash(req.body.password, SALT_ROUNDS);
      }

      if (req.body.email) updates.email = req.body.email.toLowerCase();

      const admin = await Admin.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      // Return safe info, include hasPassword flag
      const safe = {
        id: admin._id,
        email: admin.email,
        hasPassword: !!admin.password,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      res.json(safe);
    } catch (err) {
      console.error(err);
      // handle duplicate email error
      if (err.code === 11000) return res.status(409).json({ message: 'Email already in use' });
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // Delete admin
  remove: async (req, res) => {
    try {
      const { id } = req.params;
      const admin = await Admin.findByIdAndDelete(id).select('-password');
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      res.json({ message: 'Admin deleted', admin });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  },

  // Login (returns JWT)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, admin: { id: admin._id, email: admin.email } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
};

module.exports = adminController;
