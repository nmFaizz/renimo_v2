import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
    description: "Home",
}

export default function HomeLayout({
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