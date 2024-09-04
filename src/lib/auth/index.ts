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
      name: "AdminCredentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let user: any;

        console.log("admin cred", credentials);
        if (
          credentials?.email === "bucha@gmail.com" &&
          credentials?.password === "plmplmplm"
        ) {
          user = {
            email: credentials?.email,
            role: "ADMIN",
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
    // async redirect({ url, baseUrl }) {
    //   const allowedOrigins = [
    //     "admin.localhost:3000",
    //     "localhost:3000",
    //     "seller.localhost:3000",
    //   ];
    //   if (allowedOrigins.some((origin) => url.startsWith(origin))) {
    //     return url;
    //   }
    //   return baseUrl;
    // },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...token,
        },
      };
    }},
  pages: {
    signIn: "/login", // Custom login page
    error: "/error", // Error page
  },
});
