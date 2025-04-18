import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign In to Renimo",
    description: "Sign in to Renimo",
}

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}