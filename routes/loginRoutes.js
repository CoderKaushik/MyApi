// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/postModels');
const cors = require('./cors')


// POST /login
router.post('/login',cors, async (req, res) => {
  const { email, password } = req.body;
  const user =await User.find({email:email})

  if(user.length>0)
  {
  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      'yourSecretKey', // Replace with your secret key
      { expiresIn: '1h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token , userInfo:user});
      }
    );
  }catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
  }
  else{
    return res.status(404).json({ msg: 'No account found with this email' });
  }
  
});

module.exports = router;
