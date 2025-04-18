import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Renimo - Home",
    description: "Social media space for everyone",
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