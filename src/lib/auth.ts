import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log('🔐 Login attempt for:', credentials?.email);
          
          if (!credentials?.email || !credentials?.password) {
            console.error('❌ Missing credentials');
            throw new Error("Email and password are required");
          }

          // Test database connection
          try {
            await db.$connect();
            console.log('✅ Database connected');
          } catch (dbError: any) {
            console.error('❌ Database connection failed:', dbError.message);
            throw new Error("Database connection failed. Please try again later.");
          }

          const user = await db.user.findUnique({ 
            where: { email: credentials.email } 
          });

          if (!user) {
            console.error('❌ No user found with email:', credentials.email);
            throw new Error("No user found with this email");
          }

          console.log('✅ User found:', user.email, 'Role:', user.role);

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.error('❌ Invalid password for:', credentials.email);
            throw new Error("Incorrect password");
          }

          console.log('✅ Login successful for:', user.email);

          return { 
            id: user.id, 
            email: user.email, 
            role: user.role,
            name: (user as any).name 
          };
        } catch (error: any) {
          console.error('❌ Authorization error:', error.message);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};
