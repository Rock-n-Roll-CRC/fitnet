import { compare } from "bcrypt";

import { supabase } from "@/services/supabase";

export const getUserByCredentials = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", credentials.email)
    .maybeSingle();

  if (error) {
    console.error(`Failed to fetch the user by credentials: ${error.message}`);
    throw new Error(error.message, { cause: error.cause });
  }

  if (!data) return null;

  if (data.password && !(await compare(credentials.password, data.password)))
    return null;

  return data;
};

export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(error.message, { cause: error.cause });
  }

  return data;
};

export const getUserByPhoneNumber = async (phoneNumber: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phoneNumber)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(error.message, { cause: error.cause });
  }

  return data;
};
