import "../styles/global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Life",
  description: "One click informational videos",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-500">{children}</body>
    </html>
  );
}
