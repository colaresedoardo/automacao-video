export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // 👈 importe as opções do v4
import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";
import { Readable } from "stream";

const prisma = new PrismaClient();

async function getOAuthClientForUser(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  if (!account?.refresh_token) {
    throw new Error("Usuário sem refresh_token do Google. Refaça o login com consentimento.");
  }
  const oAuth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.NEXTAUTH_URL + "/api/auth/callback/google"
  );
  oAuth2.setCredentials({ refresh_token: account.refresh_token });
  return oAuth2;
}

async function ensureUserFolder(drive: any, userId: string) {
  const folderName = `Meus Vídeos (App) - ${userId}`;
  const search = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
    fields: "files(id,name)",
    spaces: "drive",
  });
  if (search.data.files?.length) return search.data.files[0].id;

  const create = await drive.files.create({
    requestBody: { name: folderName, mimeType: "application/vnd.google-apps.folder" },
    fields: "id",
  });
  return create.data.id!;
}

export async function POST(req: NextRequest) {
  
  console.log("Recebida requisição de upload de vídeo.");

  const session = await getServerSession(authOptions as any);
  console.log(session)

  if (!session?.user || !(session as any).user.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const userId = (session as any).user.id as string;

  const form = await req.formData();

  const title = String(form.get("title") ?? "");
  const description = String(form.get("description") ?? "");
  const hashtag = String(form.get("hashtag") ?? "");
  const publishedAtISO = String(form.get("publishedAt") ?? "");
  const file = form.get("file") as unknown as File | null;

  if (!title || !description || !hashtag || !publishedAtISO || !file) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = (file as any).type || "video/mp4";

  try {
    const oauth = await getOAuthClientForUser(userId);
   
    const drive = google.drive({ version: "v3", auth: oauth });

    const folderId = await ensureUserFolder(drive, userId);

    const createRes = await drive.files.create({
      requestBody: {
        name: (file as any).name || title,
        parents: [folderId],
        description,
      },
      media: { mimeType, body: Readable.from(buffer) },
      fields: "id, webViewLink",
    });


    const driveFileId = createRes.data.id!;
    const driveWebView = createRes.data.webViewLink!;
    const publishedAt = new Date(publishedAtISO);
    console.log("antes da criação");
    const video = await prisma.video.create({
      data: {
        title,
        description,
        hashtag,
        publishedAt,
        driveFileId,
        driveWebView,
        userId,
      },
    });
    console.log("Primas client criado.",video);
   
    return NextResponse.json({
      id: video.id,
      driveFileId,
      driveWebView,
      publishedAtBr: new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      }).format(publishedAt),
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Erro no upload: " + err.message }, { status: 500 });
  }
}
