import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { authenticate } from './app/lib/actions';

const BASE_API = 'http://localhost:8000';
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          // console.log("_________________________________________  ");
          // console.log('Parsed credentials:', parsedCredentials.data.email);
          // console.log('Parsed credentials:', parsedCredentials.data.password);
          const res = await fetch(`${BASE_API}/auth/login`, {
            method: 'POST',
            body: new URLSearchParams({
              username: parsedCredentials.data.email,
              password: parsedCredentials.data.password,
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

          if (res.ok) {
            const user = await res.json();
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});