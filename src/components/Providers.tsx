"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#1976d2" },
          secondary: { main: "#9c27b0" },
        },
        shape: { borderRadius: 12 },
      }),
    [mode]
  );

  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Botão simples para alternar tema (opcional) */}
        <button
          onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            padding: 10,
            zIndex: 9999,
          }}
        >
          {mode === "light" ? "🌙" : "☀️"}
        </button>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
