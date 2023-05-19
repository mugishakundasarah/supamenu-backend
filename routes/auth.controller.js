const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const  validateEmail  = require('../utils/validateEmail');

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    const { email, fullName, phoneNumber } = req.body;

    // Validate input
    if (email == undefined || fullName == undefined || phoneNumber == undefined) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if(fullName < 3){
      return res.status(400).json({ message: 'Full name is invalid' });
    }

    if(!validateEmail(email)){
      console.log(email)
      return res.status(400).json({ message: 'Email is invalid' })
    }

    if(phoneNumber.length != 10){
      return res.status(400).json({ message: 'Phone Number is invalid' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate and sign a JWT token
    const token = jwt.sign({ email: user.email }, 'your-secret-key');

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
