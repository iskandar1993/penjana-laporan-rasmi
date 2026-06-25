import React, { useState, useRef, useEffect } from "react";
import { Image, Upload, Trash2, Sliders, Layout, Download, Check, Sparkles, RefreshCw } from "lucide-react";

interface UploadedImage {
  id: string;
  url: string;
  name: string;
  file: File;
}

type FilterType = "none" | "grayscale" | "sepia" | "cool-blue" | "warm-vibrant" | "high-contrast";
type CollageLayout = "grid" | "horizontal" | "vertical" | "bento";

export default function ImageCollageGenerator({ reportTitle, reportDate }: { reportTitle: string; reportDate: string }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [filter, setFilter] = useState<FilterType>("none");
  const [layout, setLayout] = useState<CollageLayout>("grid");
  const [isDragging, setIsDragging] = useState(false);
  const [headerText, setHeaderText] = useState("DOKUMENTASI BERGAMBAR");
  const [footerText, setFooterText] = useState("KAWALAN KESELAMATAN & KELANCARAN PROGRAM");
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filter styles configuration for rendering on screen (CSS filters)
  const getFilterStyle = (type: FilterType) => {
    switch (type) {
      case "grayscale":
        return "grayscale contrast-125";
      case "sepia":
        return "sepia brightness-90 contrast-110 hue-rotate-[-10deg]";
      case "cool-blue":
        return "brightness-95 contrast-105 saturate-125 sepia-[0.15] hue-rotate-[180deg] saturate-[1.8]";
      case "warm-vibrant":
        return "saturate-150 brightness-105 sepia-[0.1] contrast-105";
      case "high-contrast":
        return "contrast-150 brightness-95 saturate-110";
      default:
        return "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (fileList: FileList) => {
    const newImages: UploadedImage[] = [];
    Array.from(fileList).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        newImages.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
          name: file.name,
          file,
        });
      }
    });

    setImages((prev) => [...prev, ...newImages].slice(0, 8)); // Limit to maximum 8 images
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const clearAllImages = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Canvas Drawing & Export
  const generateCollage = () => {
    if (images.length === 0) return;
    setIsExporting(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setIsExporting(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // High resolution canvas sizes
    const canvasWidth = 1200;
    const canvasHeight = 1000;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Fill background (Slate / White themes)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw header panel
    ctx.fillStyle = "#0f172a"; // Dark blue/slate slate-900
    ctx.fillRect(0, 0, canvasWidth, 120);

    // Draw Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(headerText.toUpperCase(), canvasWidth / 2, 55);

    // Draw Meta Text (Date & Location context)
    ctx.fillStyle = "#38bdf8"; // sky-400
    ctx.font = "bold 16px sans-serif";
    const subText = `${reportTitle ? reportTitle.substring(0, 80) : "LAPORAN MAJLIS"} | ${reportDate || ""}`;
    ctx.fillText(subText.toUpperCase(), canvasWidth / 2, 90);

    // Grid content boundaries
    const startY = 140;
    const availableHeight = canvasHeight - startY - 80;
    const contentWidth = canvasWidth - 80;
    const startX = 40;

    // Load and render images with selected filters
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const drawLayoutAndSave = () => {
      // Setup grid layout coordinates
      const imgCount = loadedImages.length;
      if (imgCount === 0) {
        setIsExporting(false);
        return;
      }

      ctx.save();

      // Draw layout based on choice
      if (layout === "vertical") {
        const itemHeight = availableHeight / imgCount;
        loadedImages.forEach((img, i) => {
          const dy = startY + i * itemHeight + 10;
          const dh = itemHeight - 20;
          drawCoverImage(ctx, img, startX, dy, contentWidth, dh, filter);
        });
      } else if (layout === "horizontal") {
        const itemWidth = contentWidth / imgCount;
        loadedImages.forEach((img, i) => {
          const dx = startX + i * itemWidth + 10;
          const dw = itemWidth - 20;
          drawCoverImage(ctx, img, dx, startY + 10, dw, availableHeight - 20, filter);
        });
      } else if (layout === "bento" && imgCount >= 2) {
        // Featured left image, others on right stacked
        const featuredWidth = (contentWidth * 0.6) - 10;
        const sideWidth = (contentWidth * 0.4) - 10;

        // Draw primary featured
        drawCoverImage(ctx, loadedImages[0], startX, startY + 10, featuredWidth, availableHeight - 20, filter);

        // Draw others on side column
        const sideCount = imgCount - 1;
        const sideItemHeight = (availableHeight - 20) / sideCount;
        for (let idx = 1; idx < imgCount; idx++) {
          const sY = startY + 10 + (idx - 1) * sideItemHeight + (idx > 1 ? 10 : 0);
          const sH = sideItemHeight - (idx > 1 ? 10 : 0);
          drawCoverImage(ctx, loadedImages[idx], startX + featuredWidth + 20, sY, sideWidth, sH, filter);
        }
      } else {
        // Standard Grid Layout (Default)
        let cols = 2;
        let rows = 2;

        if (imgCount <= 2) {
          cols = imgCount;
          rows = 1;
        } else if (imgCount <= 4) {
          cols = 2;
          rows = 2;
        } else if (imgCount <= 6) {
          cols = 3;
          rows = 2;
        } else {
          cols = 4;
          rows = 2;
        }

        const cellWidth = contentWidth / cols;
        const cellHeight = availableHeight / rows;

        loadedImages.forEach((img, index) => {
          const r = Math.floor(index / cols);
          const c = index % cols;
          const dx = startX + c * cellWidth + 8;
          const dy = startY + r * cellHeight + 8;
          const dw = cellWidth - 16;
          const dh = cellHeight - 16;
          drawCoverImage(ctx, img, dx, dy, dw, dh, filter);
        });
      }

      ctx.restore();

      // Draw footer brand/disclaimer
      ctx.fillStyle = "#1e293b"; // slate-800
      ctx.fillRect(0, canvasHeight - 65, canvasWidth, 65);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(footerText.toUpperCase(), canvasWidth / 2, canvasHeight - 38);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.fillText(`DIJANA SECARA DIGITAL PDRM / URUS SETIA KAWALAN MELAKA - ${new Date().toLocaleDateString()}`, canvasWidth / 2, canvasHeight - 15);

      // Trigger actual download of compiled file
      try {
        const imageURI = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Kolaj_Laporan_${reportDate.replace(/[\s()]/g, "_") || "PDRM"}.png`;
        link.href = imageURI;
        link.click();
      } catch (err) {
        console.error("Gagal menjana download imej kolaj:", err);
      } finally {
        setIsExporting(false);
      }
    };

    images.forEach((item) => {
      const img = window.document.createElement("img");
      img.crossOrigin = "anonymous";
      img.src = item.url;
      img.onload = () => {
        loadedImages.push(img);
        loadedCount++;
        if (loadedCount === images.length) {
          drawLayoutAndSave();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          drawLayoutAndSave();
        }
      };
    });
  };

  // Helper to draw image cover fit with custom filters
  const drawCoverImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    filterType: FilterType
  ) => {
    ctx.save();

    // Create rounded clipping path for beautiful cards
    ctx.beginPath();
    const radius = 12;
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();

    // Canvas native filters corresponding to styles
    if (filterType === "grayscale") {
      ctx.filter = "grayscale(100%) contrast(125%)";
    } else if (filterType === "sepia") {
      ctx.filter = "sepia(100%) brightness(90%) contrast(110%)";
    } else if (filterType === "cool-blue") {
      ctx.filter = "brightness(95%) contrast(105%) saturate(180%) hue-rotate(180deg)";
    } else if (filterType === "warm-vibrant") {
      ctx.filter = "saturate(150%) brightness(105%) sepia(10%) contrast(105%)";
    } else if (filterType === "high-contrast") {
      ctx.filter = "contrast(150%) brightness(95%) saturate(110%)";
    } else {
      ctx.filter = "none";
    }

    // Cover algorithm math
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const targetRatio = w / h;
    let sWidth = img.naturalWidth;
    let sHeight = img.naturalHeight;
    let sx = 0;
    let sy = 0;

    if (imgRatio > targetRatio) {
      sWidth = img.naturalHeight * targetRatio;
      sx = (img.naturalWidth - sWidth) / 2;
    } else {
      sHeight = img.naturalWidth / targetRatio;
      sy = (img.naturalHeight - sHeight) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);

    // Stroke border around item
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 2;
    ctx.filter = "none";
    ctx.stroke();

    ctx.restore();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Image className="w-5 h-5 text-sky-500" />
          <span>Kolaj & Lampiran Gambar Laporan</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Muat naik gambar lapangan atau bukti penugasan, hias dengan preset filter PDRM, dan jana satu fail kolaj berlabel kemas.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
          isDragging
            ? "border-sky-500 bg-sky-50/40 text-sky-600"
            : "border-slate-200 hover:border-sky-400 hover:bg-slate-50/50 text-slate-500"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
        <Upload className="w-8 h-8 mx-auto mb-3 text-slate-400" />
        <p className="text-sm font-semibold text-slate-700">Tarik & Letak Gambar di sini</p>
        <p className="text-xs text-slate-400 mt-1">atau klik untuk pilih fail dari telefon/komputer (Maksimum 8 gambar)</p>
      </div>

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Controls Bar: Filters and Layouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            {/* Filter Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Preset Filter Gambar</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "none", label: "Asal" },
                  { value: "grayscale", label: "H/Putih" },
                  { value: "sepia", label: "Sepia" },
                  { value: "cool-blue", label: "PDRM Biru" },
                  { value: "warm-vibrant", label: "Ceria" },
                  { value: "high-contrast", label: "Drama" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setFilter(item.value as FilterType)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition ${
                      filter === item.value
                        ? "bg-sky-600 text-white font-bold"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-slate-500" />
                <span>Susun Atur Kolaj</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { value: "grid", label: "Grid Klasik" },
                  { value: "horizontal", label: "Baris Melintang" },
                  { value: "vertical", label: "Turus Menegak" },
                  { value: "bento", label: "Bento (Utama Kiri)" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setLayout(item.value as CollageLayout)}
                    className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium transition ${
                      layout === item.value
                        ? "bg-slate-800 text-white font-bold"
                        : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Labels Inputs (Super polished feature!) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tajuk Kolaj atas (Header)</label>
              <input
                type="text"
                value={headerText}
                onChange={(e) => setHeaderText(e.target.value)}
                placeholder="DOKUMENTASI BERGAMBAR"
                className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2 transition font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Label bawah (Footer)</label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="KAWALAN KESELAMATAN & KELANCARAN PROGRAM"
                className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-3 py-2 transition font-medium"
              />
            </div>
          </div>

          {/* Grid Preview of individual images with active filters */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Gambar Dipilih ({images.length})</span>
              <button
                onClick={clearAllImages}
                className="text-[10px] text-rose-600 hover:text-rose-700 font-bold transition flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Padam Semua</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-video border border-slate-100 bg-slate-100">
                  <img
                    src={img.url}
                    alt={img.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${getFilterStyle(filter)}`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition"
                      title="Padam Gambar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export compiled collage button */}
          <button
            type="button"
            onClick={generateCollage}
            disabled={isExporting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-500 text-white py-3 px-4 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sedang Menyusun & Menyimpan Kolaj...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Muat Turun Gambar Kolaj Lampiran (.PNG)</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Hidden Canvas used for collage generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
