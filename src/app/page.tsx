// src/app/page.tsx
"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Typography variant="h3" fontWeight={700}>
            Next.js + MUI + TypeScript
          </Typography>
          <Typography color="text.secondary">
            Projeto inicial sem Tailwind, pronto para desenvolver.
          </Typography>
          <Button variant="contained" startIcon={<Add />}>
            Ação
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
