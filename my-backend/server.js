const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

// Initializing Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // For parsing application/json

// MySQL Database connection
const connection = mysql.createConnection({
  host: 'localhost',  // Your MySQL host
  user: 'root',       // Your MySQL username
  password: 'ROOT',   // Your MySQL password
  database: 'userdb'  // Your MySQL database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
  } else {
    console.log('Connected to MySQL as ID', connection.threadId);
  }
});

// Controller function to register a user
const registerUser = (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Please provide all fields.' });
  }

  const newUser = { username, email, password };

  // Insert user data into the database
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  connection.execute(query, [newUser.username, newUser.email, newUser.password], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      return res.status(500).json({ error: 'Error registering user' });
    }
    res.status(201).json({ message: 'User registered successfully' }); // Return a JSON response
  });
};

// Defining Routes
app.post('/api/users/register', registerUser);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
