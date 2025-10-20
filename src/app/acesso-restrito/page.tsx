// src/app/acesso-restrito/page.tsx
"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Box, Button, Typography, Container, Stack, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { AuthButtons } from "@/components/AuthButtons";

export default function AcessoRestritoPage() {
  const { status } = useSession(); // "authenticated" | "unauthenticated" | "loading"

  if (status === "authenticated") {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Acesso Restrito
        </Typography>
        <Typography>Você já está autenticado. Conteúdo liberado ✅</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        textAlign: "center",
      })}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: 5, borderRadius: 4 }}>
          <LockIcon sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Acesso Restrito 🔒
          </Typography>
          <Typography color="text.secondary" paragraph>
            Para continuar, faça login com sua conta.
          </Typography>
            
          <Stack direction="column" spacing={2} mt={3}>
            <AuthButtons />
          </Stack>
        </Paper>

        <Typography
          variant="body2"
          color="rgba(255,255,255,0.9)"
          sx={{ mt: 4 }}
        >
          © {new Date().getFullYear()} Seu Serviço. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}
