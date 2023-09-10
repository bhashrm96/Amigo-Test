const express = require('express');
const app = express();
const port = 3001;
const { Pool } = require('pg');
const cors = require('cors')

app.use(express.json());
app.use(cors())

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'coordinates', // database name
    password: 'pass@123',
    port: 5432, // Postgre port
  });

//  API endpoints 

app.get('/api/locations', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM locations');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching data', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
