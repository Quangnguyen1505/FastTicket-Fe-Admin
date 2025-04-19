import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | FastTickets - Next.js Dashboard Template",
  description: "This is Next.js Signin Page FastTickets Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
