import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TV Watch — Live TV",
  description: "Your personal live television hub."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
