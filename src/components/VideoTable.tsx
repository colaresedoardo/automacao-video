
"use client";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link as MuiLink,
  Chip,
  Stack,
  Tooltip,
  Button,
} from "@mui/material";

type VideoRow = {
  id: string;
  title: string;
  description: string;
  hashtag: string;
  publishedAt: string; // ISO
  driveWebView: string;
  createdAt: string;
  status?: string;
  categoria?:string;
  privacidade?:string;
};

export default function VideosTable({ videos }: { videos: VideoRow[] }) {
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (!videos.length) {
    return (
      <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
        <Typography variant="h4" gutterBottom>Meus Vídeos</Typography>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            Você ainda não cadastrou nenhum vídeo.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Meus Vídeos</Typography>
        <Button href="/cadastrar-video" variant="contained">Cadastrar novo</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Hashtag</TableCell>
              <TableCell>Publicação</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Status Publicação</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {videos.map((v) => (
              <TableRow key={v.id} hover>
                <TableCell>
                  <Tooltip title={`Criado em ${fmt.format(new Date(v.createdAt))}`}>
                    <span>{v.title}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip label={v.hashtag} variant="outlined" />
                </TableCell>
                <TableCell>{fmt.format(new Date(v.publishedAt))}</TableCell>
                <TableCell sx={{ maxWidth: 360 }}>
                  <Typography noWrap title={v.description}>
                    {v.description}
                  </Typography>
                </TableCell>
                <TableCell sx={{ maxWidth: 360 }}>
                  <Typography noWrap title={v.status}>
                    {v.status}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <MuiLink
                    href={v.driveWebView}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                  >
                    <Button size="small" variant="outlined">Abrir no Drive</Button>
                  </MuiLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
