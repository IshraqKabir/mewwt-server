require('dotenv').config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const BCRYPT_HASH_ROUNDS = 10;
export const PORT = 4000;