"use client";

import { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  LinearProgress,
  Stack,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/pt-br";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

type SubmitState = "idle" | "sending" | "success" | "error";

export default function VideoForm() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [gerarHashtagIA, setGerarHashtagIA] = useState(false);
  const [dataPublicacao, setDataPublicacao] = useState<Dayjs | null>(dayjs());
  const [video, setVideo] = useState<File | null>(null);

  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSending = status === "sending";

  const videoPreviewUrl = useMemo(() => {
    if (!video) return null;
    return URL.createObjectURL(video);
  }, [video]);

  const resetForm = () => {
    setTitulo("");
    setDescricao("");
    setHashtag("");
    setGerarHashtagIA(false);
    setDataPublicacao(dayjs());
    setVideo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const camposFaltando =
      !titulo ||
      !descricao ||
      !dataPublicacao ||
      !video ||
      (!gerarHashtagIA && !hashtag);

    if (camposFaltando) {
      setMessage("Preencha todos os campos antes de enviar.");
      setStatus("error");
      return;
    }

    try {
      setStatus("sending");
      setMessage("");

      const fd = new FormData();
      fd.append("title", titulo.trim());
      fd.append("description", descricao.trim());
      fd.append("publishedAt", dataPublicacao.toISOString());
      fd.append("file", video);
      // Se marcado, backend decide gerar; se não, vai a hashtag digitada
      fd.append("generateHashtagAI", String(gerarHashtagIA));
      if (!gerarHashtagIA) {
        fd.append("hashtag", hashtag.trim());
      }

      const resp = await fetch("/api/videos", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const json = await resp.json();

      if (!resp.ok) {
        throw new Error(json.error || "Falha ao enviar vídeo");
      }

      setStatus("success");
      setMessage("Vídeo cadastrado com sucesso! 🎉");
      resetForm();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Erro inesperado ao enviar.");
    }
  };

  const handleCloseSnackbar = () => {
    if (status !== "sending") setStatus("idle");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 600,
          mx: "auto",
        }}
      >
        <Typography variant="h4" textAlign="center">
          Cadastrar Vídeo
        </Typography>

        <TextField
          label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          fullWidth
          disabled={isSending}
        />

        <TextField
          label="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          multiline
          minRows={3}
          required
          fullWidth
          disabled={isSending}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={gerarHashtagIA}
              onChange={(e) => setGerarHashtagIA(e.target.checked)}
              disabled={isSending}
            />
          }
          label="Gerar hashtag com IA de acordo a descrição?"
        />

        <TextField
          label="Hashtag"
          value={hashtag}
          onChange={(e) => setHashtag(e.target.value)}
          placeholder="#exemplo"
          fullWidth
          disabled={isSending || gerarHashtagIA}
          required={!gerarHashtagIA}
          helperText={
            gerarHashtagIA
              ? "A hashtag será gerada automaticamente pela IA."
              : "Você pode digitar a hashtag manualmente."
          }
        />

        <DateTimePicker
          label="Data de publicação do vídeo"
          value={dataPublicacao}
          onChange={(newValue) => setDataPublicacao(newValue)}
          format="DD/MM/YYYY HH:mm"
          slotProps={{
            textField: { fullWidth: true, required: true, disabled: isSending },
          }}
        />

        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          disabled={isSending}
        >
          {video ? video.name : "Selecionar vídeo"}
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="video/*"
            onChange={(e) =>
              setVideo(
                e.target.files && e.target.files.length > 0
                  ? e.target.files[0]
                  : null
              )
            }
          />
        </Button>

        {videoPreviewUrl && (
          <video
            src={videoPreviewUrl}
            controls
            style={{ width: "100%", borderRadius: 8 }}
          />
        )}

        {isSending && <LinearProgress />}

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button
            type="button"
            variant="outlined"
            onClick={resetForm}
            disabled={isSending}
          >
            Limpar
          </Button>
          <Button type="submit" variant="contained" disabled={isSending}>
            Salvar
          </Button>
        </Stack>

        <Snackbar
          open={status === "success" || status === "error"}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={status === "success" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
