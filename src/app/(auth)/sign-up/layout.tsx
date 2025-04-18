import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up for Renimo",
    description: "Sign Up for Renimo",
}

export default function SignUpLayout({
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