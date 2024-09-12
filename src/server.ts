import app from './app';
import dotenv from 'dotenv';
// import { redisClient } from './utils/redis';
import { pool } from './utils/db';
import { createUsersTable } from './utils/db';  // Import the table creation function

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Connect to Redis if applicable
    // await redisClient.connect();
    
    console.log('DATABASE_URL:', process.env.DATABASE_URL);

    // Connect to the PostgreSQL database
    await pool.connect();

    // Create the users table if it does not exist
    await createUsersTable();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
