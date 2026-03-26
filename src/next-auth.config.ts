import NextAuth from "next-auth";
import { authConfig } from "./auth/authConfig";

export default NextAuth(authConfig);
