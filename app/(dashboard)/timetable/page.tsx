"use client";

import { useEffect, useState } from "react";
import ControlBar from "@/components/ui/ControlBar";
import DataGrid from "@/components/ui/DataGrid";
import TimetableCard, {
  TimetableEntry,
} from "@/components/timetable/TimetableCard";

export default function TimetablePage() {
  const [schedules, setSchedules] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/timetable");
      const json = await res.json();
      if (json.success) setSchedules(json.data);
    } catch (err) {
      console.error("Failed to load timetable:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.subject.toLowerCase().includes(q) ||
      s.day_of_week.toLowerCase().includes(q) ||
      s.room_no.toLowerCase().includes(q) ||
      (s.teacher_name && s.teacher_name.toLowerCase().includes(q)) ||
      (s.class_name && s.class_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Timetable Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage weekly classroom schedules, instructor allocations, and
            subject slots.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-indigo-600/20 transition-all border border-indigo-400/30">
          <span className="text-base leading-none">+</span> Add Slot
        </button>
      </div>

      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search subject, day, room, instructor..."
        filteredCount={filteredSchedules.length}
        totalCount={schedules.length}
        entityName="Class Slots"
      />

      <DataGrid
        data={filteredSchedules}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No timetable slots found matching your query."
        renderCard={(item) => (
          <TimetableCard
            item={item}
            onEdit={(slot) => console.log("Edit slot:", slot)}
            onRemove={(slot) => console.log("Remove slot:", slot)}
          />
        )}
      />
    </div>
  );
}
