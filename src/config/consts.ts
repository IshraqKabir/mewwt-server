require("dotenv").config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
export const BCRYPT_HASH_ROUNDS = 10;
export const PORT = process.env.PORT;
export const UNAUTHENTICATED = "unauthenticated";
export const UNAUTHORIZED = "unauthorized";
export const SUCCESSFUL_RESPONSE = "success";
export const UNSUCCESSFUL_RESPONSE = "failed";

// ws
export const DISCONNECT = "disconnect";
export const CONNECTION = "connection";
export const KNOW_USERS_STATUSES = "know_users_statuses";
export const USER_LOGGED_IN = "user_logged_in";
export const USER_LOGGED_OUT = "user_logged_out";
export const USER_ONLINE_STATUSES = "user_online_statuses";
export const CONNECT_ERROR = "connect_error";
