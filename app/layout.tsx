import "./globals.css";
import React from "react";

export const metadata = {
  title: "Cambridge Academy - Admin Portal",
  description: "NCC L5DC Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-app-bg text-text-main font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
