"use client";

import React, { useEffect, useState } from "react";
import { FaExclamationCircle, FaUserCheck, FaClock } from "react-icons/fa";

interface StudentPayment {
  student_id: number;
  student_name: string;
  enrollment_id: number;
  payment_id: number | null;
  amount: string | null;
  paid_date: string | null;
  status: "Paid" | "Refunded" | "Unpaid";
}

interface CompletedClassData {
  class_id: number;
  class_name: string;
  course_title: string;
  start_date: string;
  end_date: string;
  class_status: string;
  stats: { paid: number; unpaid: number; refunded: number; total: number };
  students: StudentPayment[];
}

export default function CompletedClassPayments() {
  const [completedClasses, setCompletedClasses] = useState<
    CompletedClassData[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedData = async () => {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        const res = await fetch(
          `/api/dashboard/class-payments?month=${currentMonth}`,
        );
        const result = await res.json();

        if (result.success) {
          setCompletedClasses(result.completed_unpaid_data || []);
        }
      } catch (err) {
        console.error("Failed to load completed class payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedData();
  }, []);

  if (loading) {
    return (
      <div className="text-xs text-slate-500 py-4 text-center">
        Loading completed class payments...
      </div>
    );
  }

  if (completedClasses.length === 0) {
    return null; // Don't display section if there are no overdue payments in completed classes
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-3">
        <FaExclamationCircle />
        <h2 className="text-sm font-bold text-white">
          Outstanding Unpaid Fees in Completed Classes
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {completedClasses.map((cls) => (
          <div
            key={cls.class_id}
            className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-200">
                  {cls.class_name}
                </h3>
                <p className="text-[11px] text-slate-400">{cls.course_title}</p>
              </div>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md font-semibold">
                {cls.stats.unpaid} Unpaid Dues
              </span>
            </div>

            <div className="divide-y divide-slate-800/60 pt-1">
              {cls.students
                .filter((s) => s.status === "Unpaid")
                .map((student) => (
                  <div
                    key={student.student_id}
                    className="py-2 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 font-medium">
                      {student.student_name}
                    </span>
                    <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md font-semibold">
                      Unpaid
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
