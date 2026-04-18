const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - User registration (create account)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required',
      });
    }

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email must be a Gmail address',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username Exists',
        message: 'Username already taken. Please choose a different one',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        error: 'Email Exists',
        message: 'Email already registered. Please use a different email or login',
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        doctorVerified: user.doctorVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration Failed',
      message: error.message || 'An error occurred during registration',
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required',
      });
    }

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email must be a Gmail address',
      });
    }

    // Find or create user
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        username,
        email,
        password,
      });
      await user.save();
    } else {
      // Verify password if user exists
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Authentication Failed',
          message: 'Invalid credentials',
        });
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        doctorVerified: user.doctorVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login Failed',
      message: error.message,
    });
  }
});

// POST /api/auth/check-username - Check if username exists
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username is required',
      });
    }

    const userExists = await User.findOne({ username });

    res.status(200).json({
      exists: !!userExists,
    });
  } catch (error) {
    console.error('Check username error:', error);
    res.status(500).json({
      error: 'Check username failed',
      message: error.message,
    });
  }
});

// POST /api/auth/verify - Verify token
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'The user associated with this token no longer exists',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        annotationsCount: user.annotationsCount,
        doctorVerified: user.doctorVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Verification Failed',
      message: error.message,
    });
  }
});

// POST /api/auth/logout - User logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Token is invalidated on frontend; backend just acknowledges
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Logout Failed',
      message: error.message,
    });
  }
});

// POST /api/auth/register - User registration (create account)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Username, email, and password are required',
      });
    }

    // Validate email format
    if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email must be a Gmail address',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        error: 'Username Exists',
        message: 'Username already taken. Please choose a different one',
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        error: 'Email Exists',
        message: 'Email already registered. Please use a different email or login',
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        userId: user._id,
        username: user.username,
        email: user.email,
        doctorVerified: user.doctorVerified,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration Failed',
      message: error.message || 'An error occurred during registration',
    });
  }
});

module.exports = router;
