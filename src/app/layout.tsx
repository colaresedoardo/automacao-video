import type { Metadata } from "next";
import Providers from "@/components/Providers";
import { Roboto } from "next/font/google";
import Header from "@/components/Header";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js + MUI + TypeScript + NextAuth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <Providers>
           <Header />
            {children}
          </Providers>
      </body>
    </html>
  );
}
