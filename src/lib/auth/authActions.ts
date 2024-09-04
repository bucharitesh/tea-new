"use server";

import { signIn, signOut } from "./index";

export const signout = async () => {
  await signOut();
};

export const signInCustomerCreds = async (
  email: string,
  password: string,
  redirect: boolean = false
) => {
  try {
    const response = await signIn("CustomerCredentials", {
      email,
      password,
      role: "BUYER",
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const signInAdminCreds = async (
  email: string,
  password: string,
  redirect: boolean = false
) => {
  try {
    const response = await signIn("AdminCredentials", {
      email,
      password,
      role: "ADMIN",
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
};

export const signInVendorCreds = async (
  email: string,
  password: string,
  redirect: boolean = false
) => {
  try {
    const response = await signIn("VendorCredentials", {
      email,
      password,
      role: "SELLER",
      redirect: false,
    });
    return response;
  } catch (err) {
    throw err;
  }
};
