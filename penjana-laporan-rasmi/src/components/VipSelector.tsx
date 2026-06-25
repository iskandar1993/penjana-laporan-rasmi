import React, { useState } from "react";
import { VipPerson } from "../types";
import { ArrowUp, ArrowDown, Trash2, Plus, Search, Check, ListFilter, RotateCcw } from "lucide-react";

interface VipSelectorProps {
  vips: VipPerson[];
  onChange: (updatedVips: VipPerson[]) => void;
  onReset: () => void;
}

export default function VipSelector({ vips, onChange, onReset }: VipSelectorProps) {
  const [newVipName, setNewVipName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "selected" | "unselected">("all");

  const toggleSelect = (id: string) => {
    const updated = vips.map((vip) =>
      vip.id === id ? { ...vip, selected: !vip.selected } : vip
    );
    onChange(updated);
  };

  const handleAddVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVipName.trim()) return;

    const newVip: VipPerson = {
      id: `vip-custom-${Date.now()}`,
      name: newVipName.trim(),
      selected: true,
    };

    onChange([...vips, newVip]);
    setNewVipName("");
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...vips];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    onChange(updated);
  };

  const moveDown = (index: number) => {
    if (index === vips.length - 1) return;
    const updated = [...vips];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = vips.filter((vip) => vip.id !== id);
    onChange(updated);
  };

  // Filter VIP list
  const filteredVips = vips.filter((vip) => {
    const matchesSearch = vip.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === "selected") return matchesSearch && vip.selected;
    if (filterMode === "unselected") return matchesSearch && !vip.selected;
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Senarai Kehadiran VIP</span>
            <span className="text-xs bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full font-medium">
              {vips.filter(v => v.selected).length} Terpilih
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Pilih, tambah, dan susun kedudukan VVIP ke atas/bawah.</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-sky-600 transition self-start sm:self-center"
          title="Kembalikan senarai asal 23 VIP"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Senarai Asal</span>
        </button>
      </div>

      {/* Add New VIP Form */}
      <form onSubmit={handleAddVip} className="flex gap-2">
        <input
          type="text"
          value={newVipName}
          onChange={(e) => setNewVipName(e.target.value)}
          placeholder="Taip nama VIP baharu untuk ditambah..."
          className="flex-1 text-sm bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl px-4 py-2.5 transition"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </form>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari VIP..."
            className="w-full text-xs bg-slate-50 focus:bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-xl pl-9 pr-4 py-2 transition"
          />
        </div>
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-start">
          <button
            onClick={() => setFilterMode("all")}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition ${
              filterMode === "all" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Semua ({vips.length})
          </button>
          <button
            onClick={() => setFilterMode("selected")}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition ${
              filterMode === "selected" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-emerald-600"
            }`}
          >
            Hadir ({vips.filter((v) => v.selected).length})
          </button>
          <button
            onClick={() => setFilterMode("unselected")}
            className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition ${
              filterMode === "unselected" ? "bg-white text-rose-700 shadow-sm" : "text-slate-500 hover:text-rose-600"
            }`}
          >
            Tidak Hadir ({vips.filter((v) => !v.selected).length})
          </button>
        </div>
      </div>

      {/* VIP List Items */}
      <div className="border border-slate-100 rounded-xl overflow-hidden max-h-[360px] overflow-y-auto">
        {filteredVips.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Tiada VIP dijumpai padanan penapis.
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {vips.map((vip, index) => {
              // Only render if it exists in filtered list to preserve true order indices for up/down actions
              const isFilteredOut = !filteredVips.some((fv) => fv.id === vip.id);
              if (isFilteredOut) return null;

              return (
                <div
                  key={vip.id}
                  className={`flex items-center justify-between p-3.5 hover:bg-slate-50/50 transition gap-3 group ${
                    vip.selected ? "bg-emerald-50/10" : "opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Select Click Target */}
                    <button
                      onClick={() => toggleSelect(vip.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition ${
                        vip.selected
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 bg-white group-hover:border-slate-400"
                      }`}
                    >
                      {vip.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Hierarchy Number (Only count selected VIPs for final report layout, but show active array index for editing) */}
                    <span className="text-xs font-mono text-slate-400 font-medium w-5">
                      {index + 1}
                    </span>

                    {/* VIP Name */}
                    <span
                      onClick={() => toggleSelect(vip.id)}
                      className={`text-xs md:text-sm text-left font-medium cursor-pointer break-words flex-1 pr-2 ${
                        vip.selected ? "text-slate-800 font-semibold" : "text-slate-500 line-through decoration-slate-300"
                      }`}
                    >
                      {vip.name}
                    </span>
                  </div>

                  {/* Ordering Controls & Delete */}
                  <div className="flex items-center gap-1.5 shrink-0 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition"
                      title="Alih ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === vips.length - 1}
                      className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-md transition"
                      title="Alih ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(vip.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition"
                      title="Padam VIP"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
