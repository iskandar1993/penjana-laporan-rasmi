import React, { useState } from "react";
import { AgendaItem } from "../types";
import { Plus, Trash2, Edit2, Check, X, ArrowUp, ArrowDown, ClipboardList } from "lucide-react";

interface AgendaEditorProps {
  agendas: AgendaItem[];
  onChange: (updatedAgendas: AgendaItem[]) => void;
  onReset: () => void;
}

export default function AgendaEditor({ agendas, onChange, onReset }: AgendaEditorProps) {
  const [newTime, setNewTime] = useState("");
  const [newActivity, setNewActivity] = useState("");
  const [selectedAgendaId, setSelectedAgendaId] = useState<string>(agendas[0]?.id || "");

  // Add a new timeslot
  const handleAddTimeslot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime.trim()) return;

    const newAgenda: AgendaItem = {
      id: `agenda-${Date.now()}`,
      time: newTime.trim(),
      items: [],
    };

    const updated = [...agendas, newAgenda];
    onChange(updated);
    setSelectedAgendaId(newAgenda.id);
    setNewTime("");
  };

  // Add activity to the selected timeslot
  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.trim() || !selectedAgendaId) return;

    const updated = agendas.map((agenda) => {
      if (agenda.id === selectedAgendaId) {
        return {
          ...agenda,
          items: [...agenda.items, newActivity.trim()],
        };
      }
      return agenda;
    });

    onChange(updated);
    setNewActivity("");
  };

  // Delete an entire timeslot
  const handleDeleteTimeslot = (id: string) => {
    const updated = agendas.filter((a) => a.id !== id);
    onChange(updated);
    if (selectedAgendaId === id && updated.length > 0) {
      setSelectedAgendaId(updated[0].id);
    }
  };

  // Delete a specific activity item inside a timeslot
  const handleDeleteActivity = (agendaId: string, activityIndex: number) => {
    const updated = agendas.map((agenda) => {
      if (agenda.id === agendaId) {
        return {
          ...agenda,
          items: agenda.items.filter((_, idx) => idx !== activityIndex),
        };
      }
      return agenda;
    });
    onChange(updated);
  };

  // Move activity up inside a timeslot
  const moveActivityUp = (agendaId: string, activityIndex: number) => {
    if (activityIndex === 0) return;
    const updated = agendas.map((agenda) => {
      if (agenda.id === agendaId) {
        const newItems = [...agenda.items];
        const temp = newItems[activityIndex];
        newItems[activityIndex] = newItems[activityIndex - 1];
        newItems[activityIndex - 1] = temp;
        return { ...agenda, items: newItems };
      }
      return agenda;
    });
    onChange(updated);
  };

  // Move activity down inside a timeslot
  const moveActivityDown = (agendaId: string, activityIndex: number) => {
    const updated = agendas.map((agenda) => {
      if (agenda.id === agendaId) {
        if (activityIndex === agenda.items.length - 1) return agenda;
        const newItems = [...agenda.items];
        const temp = newItems[activityIndex];
        newItems[activityIndex] = newItems[activityIndex + 1];
        newItems[activityIndex + 1] = temp;
        return { ...agenda, items: newItems };
      }
      return agenda;
    });
    onChange(updated);
  };

  // Edit timeslot string directly
  const handleEditTime = (agendaId: string, value: string) => {
    const updated = agendas.map((agenda) => {
      if (agenda.id === agendaId) {
        return { ...agenda, time: value };
      }
      return agenda;
    });
    onChange(updated);
  };

  // Edit activity text directly
  const handleEditActivityText = (agendaId: string, itemIndex: number, value: string) => {
    const updated = agendas.map((agenda) => {
      if (agenda.id === agendaId) {
        const newItems = [...agenda.items];
        newItems[itemIndex] = value;
        return { ...agenda, items: newItems };
      }
      return agenda;
    });
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 md:p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>Aturcara Majlis</span>
            <span className="text-xs bg-sky-50 text-sky-600 px-2.5 py-1 rounded-full font-medium">
              {agendas.length} Slot Waktu
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Ubah suai masa, tambah perincian agenda, dan selaraskan aturcara.</p>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-sky-600 transition self-start sm:self-center"
        >
          Reset Aturcara Lalai
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form to add timeslot */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleAddTimeslot} className="space-y-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Tambah Slot Masa Baru</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="cth: 9.30 malam"
                className="flex-1 text-xs bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-2 transition"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Slot</span>
              </button>
            </div>
          </form>

          {/* Form to add activity to currently selected timeslot */}
          <form onSubmit={handleAddActivity} className="space-y-2 bg-sky-50/20 p-4 rounded-xl border border-sky-100/40">
            <h4 className="text-xs font-semibold text-sky-800 uppercase tracking-wider">Tambah Perincian Aktiviti</h4>
            <div className="space-y-2">
              <label className="text-[10px] text-slate-400 block font-medium">Pilih Slot Masa Sasaran:</label>
              <select
                value={selectedAgendaId}
                onChange={(e) => setSelectedAgendaId(e.target.value)}
                className="w-full text-xs bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-lg p-2 transition font-medium"
              >
                {agendas.map((a) => (
                  <option key={a.id} value={a.id}>
                    Slot {a.time || "(Tiada Masa)"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="cth: Jamuan Makan, Persembahan..."
                className="flex-1 text-xs bg-white border border-slate-100 focus:border-sky-500 focus:outline-none rounded-lg px-3 py-2 transition"
              />
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of active timeslots & activities */}
        <div className="lg:col-span-7 space-y-4">
          <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {agendas.map((agenda) => (
              <div
                key={agenda.id}
                className={`p-4 transition ${
                  selectedAgendaId === agenda.id ? "bg-sky-50/20 border-l-2 border-sky-500" : "bg-white"
                }`}
                onClick={() => setSelectedAgendaId(agenda.id)}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={agenda.time}
                      onChange={(e) => handleEditTime(agenda.id, e.target.value)}
                      className="text-xs font-bold text-slate-700 bg-transparent hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 rounded px-1.5 py-0.5 border-none focus:outline-none transition w-36"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTimeslot(agenda.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition"
                    title="Padam Slot Masa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub-activities for this slot */}
                {agenda.items.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic pl-6 py-1">Tiada perincian aktiviti lagi. Tambah di panel kiri.</p>
                ) : (
                  <div className="space-y-1.5 pl-6 mt-1.5">
                    {agenda.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 group/item text-xs">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-slate-400 font-medium font-mono">-</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleEditActivityText(agenda.id, idx, e.target.value)}
                            className="bg-transparent hover:bg-slate-50 focus:bg-white rounded px-1 py-0.5 border-none focus:outline-none transition text-slate-600 flex-1 min-w-0 truncate"
                          />
                        </div>

                        {/* Reordering sub items & delete */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveActivityUp(agenda.id, idx);
                            }}
                            disabled={idx === 0}
                            className="p-0.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-30 rounded transition"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveActivityDown(agenda.id, idx);
                            }}
                            disabled={idx === agenda.items.length - 1}
                            className="p-0.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-30 rounded transition"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteActivity(agenda.id, idx);
                            }}
                            className="p-0.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
