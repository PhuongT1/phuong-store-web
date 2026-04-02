import { type Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { SignIn } from "./SignIn";

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata("signIn");

const LoginPage = () => <SignIn />;

export { LoginPage as default };
