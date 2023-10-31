import "../assets/CSS/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/redux/provider";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ICCAN Law Portal",
  description: "ICAAN Law Portal is an MIS for the ICAAN Law Firm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
