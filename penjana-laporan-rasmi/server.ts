import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    ai = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint to generate "Ulasan"
  app.post("/api/generate-ulasan", async (req, res) => {
    try {
      const { title, date, venue, attendance, customNotes, vips, agendas } = req.body;

      const vipsListStr = vips && Array.isArray(vips) 
        ? vips.filter((v: any) => v.selected).map((v: any) => v.name).join(", ")
        : "";
      
      const agendaStr = agendas && Array.isArray(agendas)
        ? agendas.map((a: any) => `Pada jam ${a.time}: ${a.items.join("; ")}`).join("\n")
        : "";

      const prompt = `
Anda adalah pegawai polis / pegawai urus setia kanan yang bertanggungjawab menulis "Ulasan" rasmi (executive summary / commentary) untuk laporan keselamatan dan kelancaran majlis rasmi kerajaan di Melaka.

Sila jana ulasan rasmi yang tersusun, formal, dan kemas dalam Bahasa Melayu berdasarkan maklumat berikut:
- Nama Majlis: ${title || "Majlis Rasmi"}
- Tarikh: ${date || "N/A"}
- Tempat: ${venue || "N/A"}
- Anggaran Kehadiran: ${attendance || "1,000 orang"}
- VIP Utama Terlibat: ${vipsListStr}
- Aturcara Utama: ${agendaStr}
- Catatan Tambahan/Isu Keselamatan: ${customNotes || "Tiada sebarang kejadian tidak diingini. Majlis berjalan lancar."}

Format ulasan MESTI mengikut format senarai bernombor seperti berikut (Gunakan format 1), 2), 3) dsb, mulakan baris baru bagi setiap nombor):
1) [Poin pertama menerangkan tentang latar belakang majlis, tujuan murni anjuran siapa, dan hubungan rapat antara kerajaan/agensi dengan masyarakat]
2) [Poin kedua menerangkan peranan majlis sebagai platform penting mendengar denyut nadi rakyat dan mendekati komuniti]
3) [Poin ketiga menyenaraikan penglibatan kehadiran VIP utama termasuk kehadiran Ketua Menteri Melaka / TYT, exco kerajaan, atau kepimpinan polis secara ringkas]
4) [Poin keempat menyatakan statistik anggaran kehadiran masyarakat / orang ramai secara spesifik dan sambutan hangat mereka]
5) [Poin kelima menekankan tentang status keselamatan, laporan kawalan keselamatan oleh pasukan polis, tiada sebarang insiden tidak diingini berlaku, majlis berjalan lancar, aman dan terkawal hasil kerjasama erat]

Gunakan bahasa Melayu rasmi yang sangat teliti, mantap, profesional dan bertaraf tinggi (corporate/police formal Malay). Sila pastikan format ulasan hanya berupa senarai bernombor 1) hingga 5) tersebut secara terus tanpa sebarang intro atau penutup. Setiap poin mesti bermula dengan nombor seperti "1) " atau "2) " dan seterusnya di baris baru.
`;

      const client = getGeminiClient();
      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      res.json({ success: true, text });
    } catch (error: any) {
      console.error("Error generating ulasan:", error);
      res.status(500).json({ success: false, error: error.message || "Gagal menjana ulasan." });
    }
  });

  // Serve assets in development or production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
