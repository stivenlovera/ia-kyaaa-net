import bcrypt from 'bcryptjs';
import { User } from './login';
import { prisma } from '@/src/app/utils/prisma';
import { IUser } from '@/src/app/_types/user.type';

// In production, use a real database (PostgreSQL, MongoDB, etc.)
export const db = {
  // Find user by email
  findUserByEmail: async (email: string): Promise<User | null> => {
    const user = await prisma.user.findFirst({
      select: {
        user_id: true,
        email: true,
        name: true,
        password: true,
        create_at: true,
        update_at: true,
      },
      where: {
        email: email
      }
    });
    if (user === null) {
      return null;
    }
    return user;
  },

  // Find user by ID
  findUserById: async (user_id: number): Promise<User | null> => {
    console.log('findUserById user_id ', user_id)
    const user = await prisma.user.findFirst({
      where: {
        user_id: user_id
      }
    });

    return user || null;
  },

  // Create new user
  createUser: async (name: string, email: string, password: string): Promise<User> => {
    /* const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    } */

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = {
      name,
      email,
      password: hashedPassword,
      user_id: 0,
      nick: name.replace(/\s/g, '')
    };
    const nuevoUsuario = await prisma.user.create({
      data: user,
    });
    return nuevoUsuario;
  },

  // Verify password
  verifyPassword: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Remove password from user object
  sanitizeUser: (user: User): Omit<User, 'password'> => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};