import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProposalKit — AI Proposals That Close Deals",
  description:
    "Generate professional proposals in 30 seconds with AI. Track views, collect e-signatures, automate follow-ups. Used by 2,000+ freelancers.",
  keywords: "proposal software, freelancer tools, AI proposals, e-signature",
  openGraph: {
    title: "ProposalKit — AI Proposals That Close Deals",
    description: "Generate professional proposals in 30 seconds with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
