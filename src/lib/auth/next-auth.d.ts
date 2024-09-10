import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      user_id: string;
      tenant: string;
      businessName: string;
      address: string;
      pincode: string;
      district: string;
      state: string;
      name: string;
      contactNo: string;
      alternateContactNo: string;
      panNo: string;
      gstNo: string;
      fssaiNo: string;
      tmcoNo: string;
      bankAccountNo: string;
      ifscCode: string;
      nameOfTransport: string;
      verification_status: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    user_id: string;
    tenant: string;
    businessName: string;
    address: string;
    pincode: string;
    district: string;
    state: string;
    name: string;
    contactNo: string;
    alternateContactNo: string;
    panNo: string;
    gstNo: string;
    fssaiNo: string;
    tmcoNo: string;
    bankAccountNo: string;
    ifscCode: string;
    nameOfTransport: string;
    verification_status: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    user_id: string;
    tenant: string;
    businessName: string;
    address: string;
    pincode: string;
    district: string;
    state: string;
    name: string;
    contactNo: string;
    alternateContactNo: string;
    panNo: string;
    gstNo: string;
    fssaiNo: string;
    tmcoNo: string;
    bankAccountNo: string;
    ifscCode: string;
    nameOfTransport: string;
    verification_status: string;
  }
}
