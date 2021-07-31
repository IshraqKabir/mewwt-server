require('dotenv').config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const BCRYPT_HASH_ROUNDS = 10;
export const PORT = process.env.PORT;
export const UNAUTHENTICATED = "unauthenticated";
export const UNAUTHORIZED = "unauthorized";
export const SUCCESSFUL_RESPONSE = "success";
export const UNSUCCESSFUL_RESPONSE = "failed";