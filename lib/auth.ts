import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        await connectToDatabase();

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user || !user.isAuthorized) {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
        const isAdminLogin = !!adminEmail && normalizedEmail === adminEmail;

        if (isAdminLogin) {
          if (!credentials.password || !user.password || user.role !== "admin") {
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            return null;
          }
        }

        user.lastLoginAt = new Date();
        await user.save();

        return {
          id: user._id.toString(),
          userId: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.userId;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId && token.email && token.name) {
        session.user.userId = token.userId;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
