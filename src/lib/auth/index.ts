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
      credentials: {
        user_id: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        tenant: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        let user: any;

        if (credentials?.tenant === "ADMIN") {
          if (
            credentials?.user_id === "admin" &&
            credentials?.password === "plmplmplm"
          ) {
            user = {
              user_id: credentials?.user_id,
              tenant: "ADMIN",
            };
            return user;
          }

          return null;
        }

        if (
          credentials?.user_id === "buyer" &&
          credentials?.password === "plmplmplm"
        ) {
          user = {
            user_id: credentials?.user_id,
            tenant: "BUYER",
          };
          return user;
        }

        return null;

        // user = await prisma.user.findUnique({
        //   where: { email: credentials?.email as string },
        // });

        // if (user && user.password && credentials?.password) {
        //   if (String(credentials.password) === String(user.password)) {
        //     return user;
        //   }
        // }

        // return null;
      },
    }),
  ],
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          tenant: user.tenant, // Explicitly add role to token
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.tenant = token.tenant; // Add role to session
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Error page
  },
});
