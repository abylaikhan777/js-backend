

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


    app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const result = await pool.query(
        'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
        [username, hashedPassword]
      );    
  
      res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  function verifyToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; 
    
      if (!token) return res.status(401).json({ message: 'Token missing' });
    
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
      });
    }
    
  
   app.get('/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try { 
      const result = await pool.query('SELECT id, username FROM users WHERE id = $1', [userId]);
      res.json(result.rows[0]);
      console.log(SECRET_KEY)
    } catch (err) {
      res.status(500).json({ message: 'Database error' });
    }
  });

  
   app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: 'Incorrect password' });
  
      const token = jwt.sign({ id: user.id, username: user.username}, SECRET_KEY, { expiresIn: '24h' });
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.listen(3000,()=>{
    console.log("server is niga");
    
  })