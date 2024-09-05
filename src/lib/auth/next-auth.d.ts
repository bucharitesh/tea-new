import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenant: string;
    } & DefaultSession["user"];
  }

  interface User {
    tenant: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    tenant: string;
  }
}
