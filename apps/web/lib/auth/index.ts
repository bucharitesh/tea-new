import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

// const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialProvider({
      name: "AdminCredentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        let user: any;

        if (credentials?.password && credentials?.email) {

          // const data = await db.query.users.findFirst({
          //   with: {
          //     email: credentials?.email,
          //     password: credentials?.password,
          //     role: "ADMIN"
          //   },
          // });

          // if (!data) throw new Error("Invalid Credentials!");

          // user = data;
          // return user;
        }

        return null;
      },
    }),
    CredentialProvider({
      name: "SellerCredentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        let user: any;

        if (credentials?.password && credentials?.email) {
          // const data = await db.query.users.findFirst({
          //   with: {
          //     email: credentials?.email,
          //     password: credentials?.password,
          //     role: "SELLER"
          //   },
          // });

          // if (!data) throw new Error("Invalid Credentials!");

          // user = data;
          // return user;
        }

        return null;
      },
    }),
    CredentialProvider({
      name: "UserCredentials",
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        let user: any;

        if (credentials?.password && credentials?.email) {
          // const data = await db.query.users.findFirst({
          //   with: {
          //     email: credentials?.email,
          //     password: credentials?.password,
          //     role: "USER"
          //   },
          // });

          // if (!data) throw new Error("Invalid Credentials!");

          // user = data;
          // return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
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
    },
  },
  pages: {
    signIn: "/auth/login", //sigin page
    error: "/auth/login",
  },
});
