"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";

export function AuthButtons() {
  const { data: session } = useSession();
  if (!session) {
    return <Button onClick={() => signIn("google")}>Entrar com Google</Button>;
  }
  return <Button onClick={() => signOut()}>Sair</Button>;
}
