import { type Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { SignUp } from "./SignUp";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("signUp");

const RegisterPage = () => <SignUp />;
