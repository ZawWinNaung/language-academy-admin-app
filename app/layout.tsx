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
    <html lang="en" className="dark">
      <body className="bg-[#090D16] text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
