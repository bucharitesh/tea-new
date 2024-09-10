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
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialProvider({
      credentials: {
        user_id: { label: "user_id", type: "text" },
        password: { label: "Password", type: "password" },
        tenant: { label: "Tenant", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.user_id || !credentials.password) {
          return null;
        }

        const user_id = credentials.user_id as string;

        let user: any;

        if (credentials?.tenant === "ADMIN") {
          // Search user in admin table
          user = await prisma.admin.findUnique({
            where: { user_id },
          });

          // check if user exists in admin table and password is correct
          if (user) {
            const isMatch = (credentials.password as string) === user.password;

            console.log(isMatch);

            if (!isMatch) {
              throw new Error("Incorrect password.");
            }

            return {
              user_id: user.user_id,
              tenant: "ADMIN",
            };
          }

          return null;
        }

        if (credentials?.tenant === "BUYER") {
          user = await prisma.buyer.findUnique({
            where: { user_id, verification_status: "VERIFIED" },
          });

          if (user) {
            const isMatch = (credentials.password as string) === user.password;

            if (!isMatch) {
              throw new Error("Incorrect password.");
            }

            return {
              ...user,
              tenant: "BUYER",
            };
          }

          return null;
        }

        if (credentials?.tenant === "SELLER") {
          user = await prisma.seller.findUnique({
            where: { user_id, verification_status: "VERIFIED" },
          });

          if (user) {
            // const isMatch = bcrypt.compareSync(
            //   credentials.password as string,
            //   user.hashedPassword
            // );

            const isMatch = (credentials.password as string) === user.password;

            if (!isMatch) {
              throw new Error("Incorrect password.");
            }

            return {
              ...user,
              tenant: "SELLER",
            };
          }

          return null;
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
          tenant: user.tenant, // Explicitly add role to token
          user_id: user.user_id,
          email: user.email,
          businessName: user.businessName,
          address: user.address,
          pincode: user.pincode,
          district: user.district,
          state: user.state,
          contactNo: user.contactNo,
          alternateContactNo: user.alternateContactNo,
          panNo: user.panNo,
          gstNo: user.gstNo,
          fssaiNo: user.fssaiNo,
          tmcoNo: user.tmcoNo,
          bankAccountNo: user.bankAccountNo,
          ifscCode: user.ifscCode,
          nameOfTransport: user.nameOfTransport,
        };
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.tenant = token.tenant; // Add role to session
        (session.user.address = token.address),
          (session.user.pincode = token.pincode),
          (session.user.district = token.district),
          (session.user.user_id = token.user_id),
          (session.user.businessName = token.businessName),
          (session.user.address = token.address),
          (session.user.pincode = token.pincode),
          (session.user.district = token.district),
          (session.user.state = token.state),
          (session.user.contactNo = token.contactNo),
          (session.user.alternateContactNo = token.alternateContactNo),
          (session.user.panNo = token.panNo),
          (session.user.gstNo = token.gstNo),
          (session.user.fssaiNo = token.fssaiNo),
          (session.user.tmcoNo = token.tmcoNo),
          (session.user.bankAccountNo = token.bankAccountNo),
          (session.user.ifscCode = token.ifscCode),
          (session.user.nameOfTransport = token.nameOfTransport);
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
    error: "/login", // Error page
  },
});
