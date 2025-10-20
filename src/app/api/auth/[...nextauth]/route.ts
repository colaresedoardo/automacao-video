import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  allowDangerousEmailAccountLinking: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/youtube",

          ].join(" "),
        },
      },
    }),
  ],
  callbacks: {
  async signIn({ user }) {
      if (!user?.email) return false;

      // Busca o usuário da sua base
      const u = await prisma.user.findUnique({
        where: { email: user.email, isActive: true },
        select: { status: true, isActive: true },
      });

      // “cadastro prévio”: só entra se existir e aprovado
      if (!u || u.status !== "APPROVED") {
        // Opcional: redireciona para página explicando aprovação/pagamento
        return "/acesso-restrito"; // ou return false; para erro padrão
      }

      // assinatura ativa:
      // if (!u.isActive) return "/assinar"; // envia para paywall

      return true;
    },    
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id; // garante id na session
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id ?? (token as any).sub ?? null;
      }
      return session;
    },

  },

  
  events: {
    async signIn({ account }) {
      if (!account) return;

      const data: any = {
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
      };
      if (account.refresh_token) data.refresh_token = account.refresh_token;
      if ((account as any).refresh_token_expires_in !== undefined) {
        data.refresh_token_expires_in = (account as any).refresh_token_expires_in;
      }

      await prisma.account.update({
        where: {
          provider_providerAccountId: {
            provider: account.provider!,
            providerAccountId: account.providerAccountId!,
          },
        },
        data,
      });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
