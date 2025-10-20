"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const pages = [
  { label: "Cadastrar Vídeo", href: "/cadastrar-video" },
  { label: "Meus Vídeos", href: "/meus-videos" },
];

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const isActive = (href: string) => href === pathname;

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        {/* Logo / título */}
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{
            mr: 2,
            textDecoration: "none",
            color: "inherit",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          App de Vídeos
        </Typography>

        {/* Menu mobile */}
        <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
          {status === "authenticated" && (
            <>
              <IconButton
                size="large"
                aria-label="abrir menu"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((p) => (
                  <MenuItem key={p.href} onClick={handleCloseNavMenu}>
                    <Button
                      component={Link}
                      href={p.href}
                      sx={{
                        color: isActive(p.href) ? "primary.main" : "text.primary",
                        width: "100%",
                        justifyContent: "flex-start",
                      }}
                    >
                      {p.label}
                    </Button>
                  </MenuItem>
                ))}
                {/* Botão de sair no menu mobile */}
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu();
                    signOut();
                  }}
                >
                  <Typography color="error" sx={{ fontWeight: 500 }}>
                    Sair
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        {/* Menu desktop */}
        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 3 }}>
          {status === "authenticated" &&
            pages.map((p) => (
              <Button
                key={p.href}
                component={Link}
                href={p.href}
                sx={{
                  mr: 1,
                  color: "inherit",
                  opacity: isActive(p.href) ? 1 : 0.8,
                  borderBottom: isActive(p.href)
                    ? "2px solid #fff"
                    : "2px solid transparent",
                  borderRadius: 0,
                }}
              >
                {p.label}
              </Button>
            ))}
        </Box>

        {/* Botão de logout (desktop) */}
        {status === "authenticated" && (
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => signOut()}
            sx={{
              ml: "auto",
              borderColor: "#fff",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Sair
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
