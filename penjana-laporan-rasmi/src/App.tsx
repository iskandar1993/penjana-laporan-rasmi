import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { initialReportData } from "./data/defaultData";
import { ReportData, VipPerson, AgendaItem, SecurityDuty } from "./types";
import VipSelector from "./components/VipSelector";
import AgendaEditor from "./components/AgendaEditor";
import MitAppInventorTutorial from "./components/MitAppInventorTutorial";
import ImageCollageGenerator from "./components/ImageCollageGenerator";
import appLogo from "./assets/images/app_logo_1782360238359.jpg";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Info,
  Smartphone
} from "lucide-react";

export default function App() {
  const [data, setData] = useState<ReportData>(initialReportData);
  const [activeTab, setActiveTab] = useState<"editor" | "tutorial">("editor");
  const [customRecipient, setCustomRecipient] = useState("");
  const [customSecurityTitle, setCustomSecurityTitle] = useState("");
  const [customSecurityCount, setCustomSecurityCount] = useState(1);
  
  // AI states
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [attendanceInput, setAttendanceInput] = useState(data.attendanceCount);
  const [customNotes, setCustomNotes] = useState(data.customNotes);

  // Copy-to-clipboard state
  const [copySuccess, setCopySuccess] = useState(false);

  // Handlers for main fields
  const handleFieldChange = (field: keyof ReportData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVipChange = (updatedVips: VipPerson[]) => {
    setData((prev) => ({ ...prev, vips: updatedVips }));
  };

  const handleAgendaChange = (updatedAgendas: AgendaItem[]) => {
    setData((prev) => ({ ...prev, agendas: updatedAgendas }));
  };

  const handleResetVips = () => {
    setData((prev) => ({ ...prev, vips: initialReportData.vips }));
  };

  const handleResetAgendas = () => {
    setData((prev) => ({ ...prev, agendas: initialReportData.agendas }));
  };

  // Add custom recipient
  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRecipient.trim()) return;
    setData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, customRecipient.trim()],
    }));
    setCustomRecipient("");
  };

  // Remove recipient
  const handleRemoveRecipient = (idx: number) => {
    setData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== idx),
    }));
  };

  // Add custom security duty
  const handleAddSecurityDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSecurityTitle.trim()) return;
    const newDuty: SecurityDuty = {
      id: `sec-${Date.now()}`,
      title: customSecurityTitle.trim().toUpperCase(),
      count: customSecurityCount,
    };
    setData((prev) => ({
      ...prev,
      securityDuties: [...prev.securityDuties, newDuty],
    }));
    setCustomSecurityTitle("");
    setCustomSecurityCount(1);
  };

  // Remove security duty
  const handleRemoveSecurityDuty = (id: string) => {
    setData((prev) => ({
      ...prev,
      securityDuties: prev.securityDuties.filter((d) => d.id !== id),
    }));
  };

  // Update security duty count
  const handleUpdateSecurityCount = (id: string, count: number) => {
    setData((prev) => ({
      ...prev,
      securityDuties: prev.securityDuties.map((d) =>
        d.id === id ? { ...d, count: Math.max(1, count) } : d
      ),
    }));
  };

  // Edit specific AI Ulasan point
  const handleEditUlasanPoint = (idx: number, value: string) => {
    setData((prev) => {
      const updated = [...prev.ulasanPoints];
      updated[idx] = value;
      return { ...prev, ulasanPoints: updated };
    });
  };

  // Add new blank ulasan point
  const handleAddUlasanPoint = () => {
    setData((prev) => ({
      ...prev,
      ulasanPoints: [...prev.ulasanPoints, ""],
    }));
  };

  // Remove specific ulasan point
  const handleRemoveUlasanPoint = (idx: number) => {
    setData((prev) => ({
      ...prev,
      ulasanPoints: prev.ulasanPoints.filter((_, i) => i !== idx),
    }));
  };

  // Call API to generate Ulasan using Gemini
  const handleGenerateUlasan = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch("/api/generate-ulasan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          date: data.date,
          venue: data.venue,
          attendance: attendanceInput,
          customNotes: customNotes,
          vips: data.vips,
          agendas: data.agendas,
        }),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Gagal menghubungi pelayan AI.");
      }

      // Parse AI output. It should be 1) ... 2) ... etc.
      const rawText = resData.text as string;
      const points = rawText
        .split(/\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        // clean up prefixes like "- 1)" or "1) " to isolate actual text, we'll reformat it later
        .map((p) => p.replace(/^\s*[-\s]*\d+\)\s*/, ""));

      if (points.length > 0) {
        setData((prev) => ({
          ...prev,
          attendanceCount: attendanceInput,
          customNotes: customNotes,
          ulasanPoints: points,
        }));
      } else {
        throw new Error("Format ulasan dijana AI tidak sah.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Ralat tidak dijangka berlaku.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Construct final plain text report for clipboard (WhatsApp format)
  const buildFinalReportText = () => {
    const selectedVips = data.vips.filter((v) => v.selected);
    const recipientStr = data.recipients.map((r) => `*${r}*`).join("\n");
    const securityStr = data.securityDuties
      .map((d) => `- ${d.count} ${d.title}`)
      .join("\n");

    const vipStr = selectedVips
      .map((v, i) => {
        // Strip any existing "N YB" or "N DCP" numbering to prevent double numbers
        const cleanedName = v.name.replace(/^\d+\s+/, "");
        return `${cleanedName}`;
      })
      .map((name, i) => `${i + 1}) ${name}`)
      .join("\n\n");

    const agendaStr = data.agendas
      .map((a) => {
        const itemsStr = a.items.map((item) => `- ${item}`).join("\n");
        return `*${a.time} :*\n${itemsStr}`;
      })
      .join("\n");

    const ulasanStr = data.ulasanPoints
      .map((point, index) => {
        const cleaned = point.replace(/^\s*[-\s]*\d+\)\s*/, "");
        return `- ${index + 1}) ${cleaned}`;
      })
      .join("\n\n");

    return `*${data.greeting}*

${recipientStr}

*${data.title.toUpperCase()}*

Tarikh : ${data.date}
Masa : ${data.timeRange}
Tempat : ${data.venue}

*Penugasan Kawalan Keselamatan :*
${securityStr}

*Kehadiran VIP :*

${vipStr}

*Aturcara Majlis :*

${agendaStr}

*Ulasan*

${ulasanStr}


*Untuk Makluman YDH Dato KP/YDH Datuk Tim.KP/YDH Tuan/Puan KJ*

*Sekian Terima kasih*`;
  };

  // Handle clipboard copy
  const handleCopyClipboard = async () => {
    const text = buildFinalReportText();
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks:", err);
    }
  };

  // Download raw TXT file
  const handleDownloadTxt = () => {
    const text = buildFinalReportText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Rasmi_${data.date.replace(/[\s()]/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Banner / Navbar */}
      <header className="bg-slate-900 text-white py-5 px-6 md:px-12 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3.5">
          <img 
            src={appLogo} 
            alt="e-Pelaporan GRKN" 
            className="w-12 h-12 rounded-xl object-cover border border-slate-700/60 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>e-Pelaporan GRKN</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded font-mono font-semibold uppercase">
                PDRM Melaka
              </span>
            </h1>
            <p className="text-xs text-slate-400">Sistem Penjanaan Laporan Penugasan Rasmi & Kawalan Keselamatan</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab("editor")}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === "editor" ? "bg-sky-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Penjana Laporan</span>
          </button>
          <button
            onClick={() => setActiveTab("tutorial")}
            className={`text-xs px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeTab === "tutorial" ? "bg-sky-600 text-white shadow-sm" : "text-slate-300 hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Tutorial MIT App Inventor</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "tutorial" ? (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              <MitAppInventorTutorial />
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Input Forms (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Section A: Latar Belakang & Maklumat Penerima */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2.5">
                    1. Maklumat Penerima & Salam
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Salam Pembuka</label>
                      <input
                        type="text"
                        value={data.greeting}
                        onChange={(e) => handleFieldChange("greeting", e.target.value)}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3.5 py-2.5 font-medium transition"
                        placeholder="cth: Assalamualaikum dan Salam Sejahtera,"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Tambah Penerima Laporan (YDH)</label>
                      <form onSubmit={handleAddRecipient} className="flex gap-1.5">
                        <input
                          type="text"
                          value={customRecipient}
                          onChange={(e) => setCustomRecipient(e.target.value)}
                          placeholder="cth: YDH Tuan / Puan KJ"
                          className="flex-1 text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2 transition"
                        />
                        <button
                          type="submit"
                          className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-medium transition shrink-0"
                        >
                          Tambah
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Recipients Badges */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Penerima Aktif:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.recipients.map((rec, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 bg-slate-50 border border-slate-100/80 text-xs text-slate-600 px-3 py-1.5 rounded-xl font-medium"
                        >
                          <span>{rec}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(i)}
                            className="text-slate-400 hover:text-rose-600 font-bold transition-colors ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section B: Perincian Majlis (Tajuk, Tarikh, Masa, Tempat) */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2.5">
                    2. Perincian Majlis
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <span>Tajuk / Nama Majlis</span>
                      <span className="text-slate-400 text-[10px] font-normal">(Ditulis dalam huruf besar)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={data.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl p-3 font-semibold uppercase leading-relaxed transition"
                      placeholder="CTH: MAJLIS PENUTUPAN PROGRAM WAKIL RAKYAT UNTUK RAKYAT..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tarikh</span>
                      </label>
                      <input
                        type="text"
                        value={data.date}
                        onChange={(e) => handleFieldChange("date", e.target.value)}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2.5 font-medium transition"
                        placeholder="cth: 20 Jun 2026 (Sabtu)"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Masa</span>
                      </label>
                      <input
                        type="text"
                        value={data.timeRange}
                        onChange={(e) => handleFieldChange("timeRange", e.target.value)}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2.5 font-medium transition"
                        placeholder="cth: 8.00 malam sehingga 10.30 malam"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Tempat / Lokasi</span>
                      </label>
                      <input
                        type="text"
                        value={data.venue}
                        onChange={(e) => handleFieldChange("venue", e.target.value)}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2.5 font-medium transition"
                        placeholder="cth: Padang Bola Sepak, Taman Seri Telok Mas, Melaka"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Penugasan Kawalan Keselamatan */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-5">
                  <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-2.5">
                    3. Penugasan Kawalan Keselamatan
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Nama Penugasan / Pangkat</label>
                      <input
                        type="text"
                        value={customSecurityTitle}
                        onChange={(e) => setCustomSecurityTitle(e.target.value)}
                        placeholder="cth: PKP, PRP, ASP, SGT..."
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2.5 uppercase font-medium transition"
                      />
                    </div>
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500">Bilangan Anggota</label>
                      <input
                        type="number"
                        min={1}
                        value={customSecurityCount}
                        onChange={(e) => setCustomSecurityCount(parseInt(e.target.value) || 1)}
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2.5 font-medium transition"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <button
                        type="button"
                        onClick={handleAddSecurityDuty}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl text-xs font-medium transition"
                      >
                        Tambah Tugas
                      </button>
                    </div>
                  </div>

                  {/* Duties list */}
                  {data.securityDuties.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Tiada penugasan keselamatan diisi.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {data.securityDuties.map((duty) => (
                        <div
                          key={duty.id}
                          className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-700">{duty.title} :</span>
                            <input
                              type="number"
                              min={1}
                              value={duty.count}
                              onChange={(e) => handleUpdateSecurityCount(duty.id, parseInt(e.target.value) || 1)}
                              className="w-12 bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded px-1.5 py-0.5 text-center font-semibold"
                            />
                            <span className="text-slate-500">Anggota</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSecurityDuty(duty.id)}
                            className="text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section D: VIP Selector */}
                <VipSelector 
                  vips={data.vips} 
                  onChange={handleVipChange} 
                  onReset={handleResetVips}
                />

                {/* Section E: Aturcara Editor */}
                <AgendaEditor 
                  agendas={data.agendas} 
                  onChange={handleAgendaChange} 
                  onReset={handleResetAgendas}
                />

                {/* Section F: AI Ulasan Generator */}
                <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-sky-500" />
                      <span>Jana Ulasan Pintar (AI)</span>
                    </h3>
                    <span className="text-[10px] bg-slate-50 text-slate-400 border border-slate-100 px-2 py-0.5 rounded-full font-mono font-medium">
                      Gemini-3.5-Flash
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Sistem akan menganalisis aturcara, kehadiran VIP, dan tarikh majlis untuk menjana laporan ulasan formal yang rapi mengikut susunan bernombor 1) hingga 5) secara automatik.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Anggaran Jumlah Kehadiran Orang Ramai</span>
                      </label>
                      <input
                        type="text"
                        value={attendanceInput}
                        onChange={(e) => setAttendanceInput(e.target.value)}
                        placeholder="cth: 1,000 orang"
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3.5 py-2.5 transition"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                        <span>Nota Tambahan Keselamatan / Kelancaran</span>
                      </label>
                      <input
                        type="text"
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="cth: Majlis lancar, aman, tiada insiden tidak diingini."
                        className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3.5 py-2.5 transition"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateUlasan}
                    disabled={isGenerating}
                    className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sedang Menganalisis & Menjana Ulasan...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Jana Ulasan dengan AI ⚡</span>
                      </>
                    )}
                  </button>

                  {aiError && (
                    <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs flex items-start gap-2">
                      <span className="font-bold shrink-0">Ralat:</span>
                      <span>{aiError}</span>
                    </div>
                  )}

                  {/* Editable Ulasan Points */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Perenggan Ulasan Semasa:</span>
                      <button
                        onClick={handleAddUlasanPoint}
                        className="text-xs text-sky-600 hover:text-sky-700 transition font-medium flex items-center gap-0.5"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah Poin</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {data.ulasanPoints.map((point, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-xs font-mono font-bold text-slate-400 pt-3 w-6 shrink-0">
                            {idx + 1})
                          </span>
                          <textarea
                            rows={2}
                            value={point}
                            onChange={(e) => handleEditUlasanPoint(idx, e.target.value)}
                            className="flex-1 text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl p-2.5 leading-relaxed transition"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveUlasanPoint(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition mt-1.5 shrink-0"
                            title="Padam poin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section G: Image Collage & Attachment Generator */}
                <ImageCollageGenerator reportTitle={data.title} reportDate={data.date} />

              </div>

              {/* Right Column: Live Report Preview (5 Cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-4 space-y-5">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 md:p-6 shadow-lg text-white space-y-6">
                  
                  {/* Preview Title bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200">Pratinjau Laporan Rasmi</h3>
                      <p className="text-[10px] text-slate-500">Format salinan sedia untuk ditampal ke WhatsApp</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-slate-400 font-mono">LIVE PREVIEW</span>
                    </div>
                  </div>

                  {/* Simulated WhatsApp Chat Bubble */}
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 font-mono text-[11px] md:text-xs leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text text-emerald-100/90 shadow-inner scrollbar-thin scrollbar-thumb-emerald-900/50">
                    <p className="text-emerald-300/60 text-[9px] mb-2 font-sans border-b border-emerald-900/20 pb-1.5">
                      --- SALINAN WHATSAPP MEMO ---
                    </p>
                    
                    {/* Greeting & Recipients */}
                    <span className="text-yellow-200">*{data.greeting}*</span>
                    <br />
                    <br />
                    {data.recipients.map((rec, i) => (
                      <React.Fragment key={i}>
                        <span className="text-yellow-200">*{rec}*</span>
                        <br />
                      </React.Fragment>
                    ))}
                    <br />
                    
                    {/* Bolded Title */}
                    <span className="text-yellow-200">*{data.title.toUpperCase()}*</span>
                    <br />
                    <br />

                    {/* Meta */}
                    <span>Tarikh : {data.date}</span>
                    <br />
                    <span>Masa : {data.timeRange}</span>
                    <br />
                    <span>Tempat : {data.venue}</span>
                    <br />
                    <br />

                    {/* Security duties */}
                    <span className="text-yellow-200">*Penugasan Kawalan Keselamatan :*</span>
                    <br />
                    {data.securityDuties.map((d) => (
                      <span key={d.id}>- {d.count} {d.title}<br /></span>
                    ))}
                    <br />

                    {/* VIPs list */}
                    <span className="text-yellow-200">*Kehadiran VIP :*</span>
                    <br />
                    <br />
                    {data.vips.filter(v => v.selected).map((vip, i) => (
                      <span key={vip.id}>
                        {i + 1}) {vip.name}
                        <br />
                        <br />
                      </span>
                    ))}

                    {/* Agenda list */}
                    <span className="text-yellow-200">*Aturcara Majlis :*</span>
                    <br />
                    <br />
                    {data.agendas.map((a) => (
                      <span key={a.id}>
                        <span className="text-yellow-100">*{a.time} :*</span>
                        <br />
                        {a.items.map((item, idx) => (
                          <span key={idx}>- {item}<br /></span>
                        ))}
                      </span>
                    ))}
                    <br />

                    {/* Ulasan list */}
                    <span className="text-yellow-200">*Ulasan*</span>
                    <br />
                    <br />
                    {data.ulasanPoints.map((point, index) => (
                      <span key={index}>
                        - {index + 1}) {point.replace(/^\s*[-\s]*\d+\)\s*/, "")}
                        <br />
                        <br />
                      </span>
                    ))}

                    {/* Closing info */}
                    <span className="text-emerald-300">*Untuk Makluman YDH Dato KP/YDH Datuk Tim.KP/YDH Tuan/Puan KJ*</span>
                    <br />
                    <br />
                    <span className="text-emerald-300">*Sekian Terima kasih*</span>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCopyClipboard}
                      className={`py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        copySuccess 
                          ? "bg-emerald-600 text-white" 
                          : "bg-sky-600 hover:bg-sky-700 text-white"
                      }`}
                    >
                      {copySuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Berjaya Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Salin Teks Laporan</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-3.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Muat Turun .TXT</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-start gap-2 leading-relaxed">
                    <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-300">Format Pintar:</span> Simbol asterik (*) akan ditukar menjadi tulisan tebal (bold) secara automatik apabila anda menampal laporan ke dalam aplikasi <span className="text-emerald-400 font-semibold">WhatsApp</span>.
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/60 py-4 px-6 md:px-12 text-center text-[10px] text-slate-500 shrink-0 mt-auto">
        <span>Sistem Penjana Laporan Rasmi &copy; {new Date().getFullYear()} Melaka. Dibina untuk mengoptimumkan kecekapan urus setia pentadbiran.</span>
      </footer>
    </div>
  );
}
