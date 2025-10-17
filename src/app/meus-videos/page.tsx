// src/app/meus-videos/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import VideosTable from "@/components/VideoTable";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic"; 

export default async function MeusVideosPage() {
  const session = await getServerSession(authOptions as any);
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/meus-videos");
  }

  // pega id via callbacks (já configurados) ou busca pelo email
  let userId = (session.user as any).id as string | undefined;
  if (!userId && session.user.email) {
    const u = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    userId = u?.id;
  }
  if (!userId) redirect("/api/auth/signin?callbackUrl=/meus-videos");

  const videos = await prisma.video.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      hashtag: true,
      publishedAt: true,
      driveWebView: true,
      createdAt: true,
    },
  });

  // serialize datas para o cliente
  const data = videos.map(v => ({
    ...v,
    publishedAt: v.publishedAt.toISOString(),
    createdAt: v.createdAt.toISOString(),
  }));


  return <VideosTable videos={data} />;
}
