import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/homePage/header/Header";
import { AuthProvider } from '@/context/AuthContext';
import NavbarWrapper from "./NavbarWrapper";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata for SEO - this should be exported separately
export const metadata = {
  title: "Asha Beauty Parlour | Professional Salon & Makeup Services",
  description:
    "Discover Asha Beauty Parlour – your one-stop destination for expert hairstyling, bridal makeup, skincare, and beauty treatments. Look flawless for every occasion.",
  keywords: [
    "Asha Beauty Parlour",
    "Beauty salon",
    "Makeup artist",
    "Bridal makeup",
    "Haircut",
    "Facial treatments",
    "Skincare",
    "Hairstyling",
  ],
  authors: [{ name: "Asha Beauty Parlour" }],
  openGraph: {
    title: "Asha Beauty Parlour | Professional Salon & Makeup Services",
    description:
      "Transform your look with expert hairstyling, makeup artistry, and skin treatments at Asha Beauty Parlour.",
    url: "https://yourdomain.com",
    siteName: "Asha Beauty Parlour",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Asha Beauty Parlour",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asha Beauty Parlour | Professional Salon & Makeup Services",
    description:
      "Expert hairstyling, makeup artistry, and facials – only at Asha Beauty Parlour.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <NavbarWrapper/>
          <main className="min-h-screen">
            {children}
            <Analytics />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}