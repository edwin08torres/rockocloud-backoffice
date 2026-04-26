import axios from "axios";
import {
  Upload,
  Music,
  X,
  Loader2,
  CloudUpload,
  FileAudio,
  Clock,
  Mic2,
  Search,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
  Disc,
  ListMusic,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "../stores/useAuthStore";

const API_URL = "http://localhost:5165";
const ITEMS_PER_PAGE = 10;


interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number; // Seconds
}


function formatDuration(seconds: number) {
  if (!seconds || isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}


function SongSkeleton() {
  return (
    <div
      style={{
        background: "#0f172a",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.8s infinite",
          marginRight: "16px",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ width: "20%", height: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s infinite" }} />
        <div style={{ width: "15%", height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s infinite" }} />
      </div>
    </div>
  );
}


function DualUploadModal({
  onClose,
  onUploaded,
}: {
  onClose: () => void;
  onUploaded: () => void;
}) {
  const { token } = useAuthStore();
  const [mode, setMode] = useState<"file" | "link">("file");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Metadata Fields
  const [artist, setArtist] = useState("");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");

  // File State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Link State
  const [url, setUrl] = useState("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  const handleFileSelection = (selectedFile: File) => {
    const validTypes = ["audio/mpeg", "audio/mp3", "video/mp4"];
    const validExtensions = [".mp3", ".mp4"];
    const isValidType = validTypes.includes(selectedFile.type);
    const isValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValidType && !isValidExt) {
      toast.error("Formato no soportado. Usa MP3 o MP4.");
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (!artist.trim() || !genre.trim()) {
      toast.error("El Artista y el Género son obligatorios.");
      return;
    }

    if (mode === "file" && !file) {
      toast.error("Debes seleccionar un archivo.");
      return;
    }
    if (mode === "link" && !url.trim()) {
      toast.error("Debes ingresar una URL válida.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "file") {
        const formData = new FormData();
        formData.append("File", file!);
        formData.append("Artist", artist.trim());
        formData.append("Album", album.trim());
        formData.append("Genre", genre.trim());

        await axios.post(`${API_URL}/api/Music/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Archivo subido y procesado correctamente.");
      } else {
        await axios.post(
          `${API_URL}/api/Music/download`,
          {
            url: url.trim(),
            artist: artist.trim(),
            album: album.trim(),
            genre: genre.trim(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Audio descargado y procesado correctamente.");
      }

      onUploaded();
      onClose();
    } catch (err: unknown) {
      let msg = "Error al procesar la canción.";
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        msg = typeof d === "string" ? d : d.message ?? d.title ?? d.detail ?? msg;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#f1f5f9",
    background: "rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "540px",
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px 10px",
            }}
          >
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9" }}>
              Agregar Canción
            </h2>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              <X style={{ width: "20px", height: "20px" }} />
            </button>
          </div>

          <div style={{ display: "flex", padding: "0 24px", gap: "24px" }}>
            <button
              onClick={() => setMode("file")}
              disabled={isSubmitting}
              style={{
                padding: "10px 0",
                fontSize: "14px",
                fontWeight: 500,
                color: mode === "file" ? "#a5b4fc" : "#64748b",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${mode === "file" ? "#6366f1" : "transparent"}`,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "-1px",
              }}
            >
              <FileAudio style={{ width: "16px", height: "16px" }} />
              Archivo Local
            </button>
            <button
              onClick={() => setMode("link")}
              disabled={isSubmitting}
              style={{
                padding: "10px 0",
                fontSize: "14px",
                fontWeight: 500,
                color: mode === "link" ? "#a5b4fc" : "#64748b",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${mode === "link" ? "#6366f1" : "transparent"}`,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "-1px",
              }}
            >
              <LinkIcon style={{ width: "16px", height: "16px" }} />
              Desde Link
            </button>
          </div>
        </div>

        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Artista *</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Ej. Bad Bunny"
                style={inputStyle}
                disabled={isSubmitting}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Álbum <span style={{opacity:0.6}}>(opc)</span></label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="Ej. Un Verano Sin Ti"
                style={inputStyle}
                disabled={isSubmitting}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Género *</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Ej. Reggaeton"
                style={inputStyle}
                disabled={isSubmitting}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          </div>

          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.06)", margin: "0 0 24px 0" }} />

          {mode === "file" ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isSubmitting && fileInputRef.current?.click()}
              style={{
                width: "100%",
                height: "180px",
                borderRadius: "16px",
                border: `2px dashed ${
                  isDragging ? "#6366f1" : file ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.15)"
                }`,
                background: isDragging
                  ? "rgba(99,102,241,0.05)"
                  : file
                  ? "rgba(52,211,153,0.05)"
                  : "rgba(0,0,0,0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".mp3,.mp4,audio/mpeg,audio/mp3,video/mp4"
                style={{ display: "none" }}
                disabled={isSubmitting}
              />

              {file ? (
                <>
                  <FileAudio style={{ width: "32px", height: "32px", color: "#34d399" }} />
                  <div style={{ textAlign: "center", padding: "0 20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#e2e8f0", wordBreak: "break-all" }}>
                      {file.name}
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CloudUpload style={{ width: "36px", height: "36px", color: "#818cf8" }} />
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#e2e8f0" }}>
                      Arrastra tu archivo aquí o haz clic
                    </p>
                    <p style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      Formatos: MP3, MP4
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>
                <LinkIcon style={{ width: "14px", height: "14px" }} />
                URL del Audio/Video (Ej. YouTube)
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                style={{ ...inputStyle, padding: "14px 16px" }}
                disabled={isSubmitting}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              />
            </div>
          )}

          <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#e2e8f0",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                flex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "14px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                background: isSubmitting ? "rgba(99,102,241,0.4)" : "#6366f1",
                border: "none",
                borderRadius: "12px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                  Procesando audio en el servidor...
                </>
              ) : (
                <>
                  <Upload style={{ width: "18px", height: "18px" }} />
                  Confirmar Subida
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CATALOG PAGE
═══════════════════════════ */

export default function Catalog() {
  const { token } = useAuthStore();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Filters & Pagination State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Song[]>(`${API_URL}/api/Music/library`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSongs(data);
    } catch {
      toast.error("No se pudo cargar el catálogo musical.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Derived State: Genres
  const uniqueGenres = useMemo(() => {
    const genres = new Set(songs.map((s) => s.genre).filter(Boolean));
    return Array.from(genres).sort();
  }, [songs]);

  // Derived State: Filtered & Paginated Data
  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchSearch =
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchGenre = selectedGenre ? song.genre === selectedGenre : true;
      return matchSearch && matchGenre;
    });
  }, [songs, searchQuery, selectedGenre]);

  const totalPages = Math.max(1, Math.ceil(filteredSongs.length / ITEMS_PER_PAGE));
  const currentSongs = filteredSongs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
            Catálogo Musical
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "6px" }}>
            Gestiona la librería de música y videos de tus rockolas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            background: "#6366f1",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#818cf8";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#6366f1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Upload style={{ width: "18px", height: "18px" }} />
          Subir Música
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          padding: "16px",
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "16px",
        }}
      >
        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "16px",
              height: "16px",
              color: "#64748b",
            }}
          />
          <input
            type="text"
            placeholder="Buscar por canción o artista..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 40px",
              fontSize: "14px",
              color: "#f1f5f9",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              outline: "none",
              transition: "border-color 0.2s ease",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          />
        </div>
        <div style={{ flex: "0 0 200px" }}>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: "14px",
              color: "#f1f5f9",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              paddingRight: "40px",
            }}
          >
            <option value="" style={{ background: "#1e293b" }}>Todos los géneros</option>
            {uniqueGenres.map((g) => (
              <option key={g} value={g} style={{ background: "#1e293b" }}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", background: "#0f172a", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SongSkeleton key={i} />
          ))}
        </div>
      ) : songs.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "80px 24px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ListMusic style={{ width: "32px", height: "32px", color: "#818cf8" }} />
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>
              Sube tu primera canción
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "340px" }}>
              Comienza a construir tu librería musical usando archivos MP3 locales o descargando directamente desde YouTube.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: "#6366f1",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
              marginTop: "8px",
            }}
          >
            <CloudUpload style={{ width: "18px", height: "18px" }} />
            Comenzar Subida
          </button>
        </div>
      ) : filteredSongs.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", background: "#0f172a", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
           <p style={{ color: "#94a3b8" }}>No se encontraron canciones que coincidan con los filtros.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 24px",
                background: "rgba(0,0,0,0.2)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontSize: "12px",
                fontWeight: 600,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              <div style={{ flex: 1, paddingLeft: "52px" }}>Canción</div>
              <div style={{ width: "140px" }}>Género</div>
              <div style={{ width: "80px", textAlign: "right" }}>Duración</div>
            </div>

            {currentSongs.map((song, idx) => (
              <div
                key={song.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 24px",
                  borderBottom: idx < currentSongs.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    flexShrink: 0,
                  }}
                >
                  <Disc style={{ width: "18px", height: "18px", color: "#818cf8" }} />
                </div>

                <div style={{ flex: 1, minWidth: 0, paddingRight: "16px" }}>
                  <p
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#f1f5f9",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: 1.4,
                    }}
                  >
                    {song.title}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "2px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Mic2 style={{ width: "12px", height: "12px" }} />
                    {song.artist}
                  </p>
                </div>

                <div style={{ width: "140px", flexShrink: 0 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      background: "rgba(56,189,248,0.1)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#38bdf8",
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {song.genre || "N/A"}
                  </span>
                </div>

                <div
                  style={{
                    width: "80px",
                    flexShrink: 0,
                    textAlign: "right",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "6px",
                    fontFamily: "'Courier New', Courier, monospace",
                  }}
                >
                  <Clock style={{ width: "14px", height: "14px", color: "#475569" }} />
                  {formatDuration(song.duration)}
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 4px",
              }}
            >
              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Mostrando <span style={{ color: "#e2e8f0", fontWeight: 500 }}>{currentSongs.length}</span> resultados
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: currentPage === 1 ? "#475569" : "#e2e8f0",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if(currentPage !== 1) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { if(currentPage !== 1) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  <ChevronLeft style={{ width: "16px", height: "16px" }} />
                  Anterior
                </button>
                
                <span style={{ fontSize: "14px", color: "#94a3b8", fontWeight: 500 }}>
                  Página <span style={{ color: "#f1f5f9" }}>{currentPage}</span> de {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "8px 12px",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: currentPage === totalPages ? "#475569" : "#e2e8f0",
                    fontSize: "13px",
                    fontWeight: 500,
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { if(currentPage !== totalPages) e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                  onMouseLeave={(e) => { if(currentPage !== totalPages) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                >
                  Siguiente
                  <ChevronRight style={{ width: "16px", height: "16px" }} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <DualUploadModal
          onClose={() => setShowModal(false)}
          onUploaded={fetchCatalog}
        />
      )}
    </div>
  );
}
