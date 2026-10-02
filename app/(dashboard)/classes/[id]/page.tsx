"use client";

import React, { use } from "react";
import Link from "next/link";
import useSWR from "swr";
import { FaArrowLeft } from "react-icons/fa";
import { useClassDetail } from "@/hooks/useClassDetail";
import { fetchCourses } from "@/services/classService";
import { ClassDetailCard } from "@/components/classes/ClassDetailCard";
import { EnrolledStudentsTable } from "@/components/classes/EnrolledStudentsTable";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const classId = resolvedParams?.id;

  const {
    classDetail,
    students,
    loading,
    isError,
    savingClass,
    updatingEnrollmentId,
    saveClassMeta,
    changeStudentStatus,
  } = useClassDetail(classId);

  const { data: coursesRes } = useSWR("/api/courses", fetchCourses);
  const courses = coursesRes?.data ?? [];

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading class details...
      </div>
    );
  }

  if (isError || !classDetail) {
    return (
      <div className="p-8 text-center text-slate-400">
        Class not found or failed to load.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/classes"
          className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white rounded-xl transition-all"
        >
          <FaArrowLeft className="text-xs" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            {classDetail.name}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {classDetail.class_status}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Course: {classDetail.course_title} ({classDetail.course_code})
          </p>
        </div>
      </div>

      {/* Grid layout with independent self-start heights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Class Detail Profile Card */}
        <div className="lg:col-span-1">
          <ClassDetailCard
            classDetail={classDetail}
            courses={courses}
            saving={savingClass}
            onSave={saveClassMeta}
          />
        </div>

        {/* Right Column: Enrolled Students Table */}
        <div className="lg:col-span-2">
          <EnrolledStudentsTable
            students={students}
            updatingId={updatingEnrollmentId}
            onStatusChange={changeStudentStatus}
          />
        </div>
      </div>
    </div>
  );
}
