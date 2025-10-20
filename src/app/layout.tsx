import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js + MUI + TypeScript + NextAuth",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // pega a sessão no servidor
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <Providers>
          {/* Renderiza o Header apenas se o usuário estiver autenticado */}
          {session && <Header />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
