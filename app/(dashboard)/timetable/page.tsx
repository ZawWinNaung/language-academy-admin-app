"use client";

import { useState } from "react";
import TimetableCard from "@/components/timetable/TimetableCard";
import DataGrid from "@/components/ui/DataGrid";
import { FilterBar } from "@/components/ui/FilterBar";
import HeaderBar from "@/components/ui/HeaderBar";
import Pagination from "@/components/ui/Pagination";
import { useTimetable } from "@/hooks/useTimetable";

const DAY_OPTIONS = [
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
  { label: "Sunday", value: "Sunday" },
];

export default function TimetablePage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");

  const pageSize = 20;

  const { schedules, pagination, loading } = useTimetable({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    day: selectedDay,
  });

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleDayChange = (val: string) => {
    setSelectedDay(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDay("");
    setCurrentPage(1);
  };

  const isFiltered = Boolean(searchQuery || selectedDay);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderBar
        title="Timetable Schedule"
        description="Manage weekly classroom schedules, instructor allocations, and subject slots."
      >
        <button className="inline-flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-brand-primary/20 transition-all border border-brand-primary/30 cursor-pointer">
          <span className="text-base leading-none">+</span> Add Slot
        </button>
      </HeaderBar>

      <FilterBar>
        <FilterBar.Search
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search subject, instructor, or class..."
        />

        <FilterBar.Group>
          {/* Day Filter */}
          <FilterBar.Select
            value={selectedDay}
            onChange={handleDayChange}
            options={DAY_OPTIONS}
            placeholder="All Days"
          />

          {isFiltered && <FilterBar.Reset onReset={handleResetFilters} />}

          <FilterBar.Counter
            filteredCount={pagination.totalItems}
            totalCount={pagination.totalItems}
            entityName="Schedules"
          />
        </FilterBar.Group>
      </FilterBar>

      <DataGrid
        data={schedules}
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

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
          totalItems={pagination.totalItems}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}
