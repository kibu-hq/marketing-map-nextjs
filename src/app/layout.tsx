import type { Metadata } from "next";
import { Asap } from "next/font/google";
import "./globals.css";
import "./calendly-custom.css";

const asap = Asap({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-asap",
});

export const metadata: Metadata = {
  title: "Customer Map",
  description: "Interactive map showing Kibu customer locations across the United States",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        ></script>
      </head>
      <body className={`${asap.variable} font-[family-name:var(--font-asap)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
