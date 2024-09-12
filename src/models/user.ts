import { pool } from '../utils/db';

// Define the User model interface
interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

// Utility function to find a user by email
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};

// Utility function to find a user by id
export const findUserById = async (id: string): Promise<User | null> => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return null;
  }
};

// Utility function to create a new user
export const createUser = async (username: string, email: string, passwordHash: string): Promise<User | null> => {
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, username, email, created_at, updated_at`,
      [username, email, passwordHash]
    );
    return result.rows[0] as User;
  } catch (error) {
    console.error('Error creating new user:', error);
    return null;
  }
};
