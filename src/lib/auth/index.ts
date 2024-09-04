import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

// const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },
      async authorize(credentials) {
        let user: any;

        if (credentials?.role === "ADMIN") {
          if (
            credentials?.email === "bucha@gmail.com" &&
            credentials?.password === "plmplmplm"
          ) {
            user = {
              email: credentials?.email,
              role: "ADMIN"
            }
            return user;
          }

          return null;
        }

        user = await prisma.user.findUnique({
          where: { email: credentials?.email as string },
        });

        if (user && user.password && credentials?.password) {
          if (String(credentials.password) === String(user.password)) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.role = user.role; // Add role to session object
      session.user.id = user.id; // Add user id to session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Error page
  },
});
