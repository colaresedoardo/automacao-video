"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { AuthButtons } from "@/components/AuthButtons";

export default function HomePage() {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Bem-vindo ao App de Vídeos
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Cadastre seus vídeos e acesse sua lista no Google Drive.
        </Typography>

        {status !== "authenticated" ? (
          <AuthButtons />
        ) : (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              component={Link}
              href="/cadastrar-video"
              variant="contained"
            >
              Cadastrar Vídeo
            </Button>
            <Button
              component={Link}
              href="/meus-videos"
              variant="outlined"
            >
              Meus Vídeos
            </Button>
          </Stack>
        )}
      </Box>
    </Container>
  );
}
