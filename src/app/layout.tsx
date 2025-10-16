import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "@/components/Providers";

const roboto = Roboto({
  weight: ["300","400","500","700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Automação",
  description: "Automação de postagem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        {/* Insertion point do Emotion/MUI */}
        <meta name="emotion-insertion-point" content="" />
      </head>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
