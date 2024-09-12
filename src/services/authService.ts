// // src/services/authService.ts

// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { createUser, findUserByEmail, findUserById } from '../models/user';

// export const registerUser = async (username: string, email: string, password: string) => {
//   try {
//     // Check if user already exists
//     const existingUser = await findUserByEmail(email);
//     if (existingUser) {
//       return { error: 'User already exists' };
//     }

//     // Hash the password
//     const passwordHash = await bcrypt.hash(password, 10);

//     // Create a new user in the database
//     const newUser = await createUser(username, email, passwordHash);

//     if (!newUser) {
//       return { error: 'Error creating user' };
//     }

//     return { success: 'User registered successfully', user: newUser };
//   } catch (error) {
//     console.error('Error registering user:', error);
//     return { error: 'Error registering user' };
//   }
// };

// export const loginUser = async (email: string, password: string) => {
//   try {
//     // Find the user by email
//     const user = await findUserByEmail(email);
//     if (!user) {
//       return { error: 'Invalid credentials' };
//     }

//     // Compare the hashed password
//     const isPasswordValid = await bcrypt.compare(password, user.password_hash);
//     if (!isPasswordValid) {
//       return { error: 'Invalid credentials' };
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

//     return { success: 'Login successful', token };
//   } catch (error) {
//     console.error('Error logging in:', error);
//     return { error: 'Error logging in' };
//   }
// };

// export const verifyToken = (token: string) => {
//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     return { success: 'Token valid', decoded };
//   } catch (error) {
//     return { error: 'Invalid token' };
//   }
// };

// export const findUserByIdService = async (id: string) => {
//   try {
//     const user = await findUserById(id);
//     if (!user) {
//       return { error: 'User not found' };
//     }
//     return { success: 'User found', user };
//   } catch (error) {
//     console.error('Error fetching user by id:', error);
//     return { error: 'Error fetching user' };
//   }
// };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../models/user';

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    if (!username || !email || !password) {
      return { error: 'All fields are required' };
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return { error: 'User already exists' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await createUser(username, email, passwordHash);
    if (!newUser) {
      return { error: 'Error creating user' };
    }

    return { success: 'User registered successfully', user: newUser };
  } catch (error) {
    console.error('Error registering user:', error);
    return { error: 'Error registering user' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: 'Invalid credentials' };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return { success: 'Login successful', token };
  } catch (error) {
    console.error('Error logging in:', error);
    return { error: 'Error logging in' };
  }
};

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return { success: 'Token valid', decoded };
  } catch (error) {
    return { error: 'Invalid token' };
  }
};

export const findUserByIdService = async (id: string) => {
  try {
    const user = await findUserById(id);
    if (!user) {
      return { error: 'User not found' };
    }
    return { success: 'User found', user };
  } catch (error) {
    console.error('Error fetching user by id:', error);
    return { error: 'Error fetching user' };
  }
};
