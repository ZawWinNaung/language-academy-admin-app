"use client";

import React, { use } from "react";
import { useClassDetail } from "@/hooks/classes";
import { ClassDetailCard } from "@/components/classes/ClassDetailCard";
import { EnrolledStudentsTable } from "@/components/classes/EnrolledStudentsTable";
import { useRouter, useSearchParams } from "next/navigation";
import DetailFrame from "@/components/ui/DetailFrame";

export default function ClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const backHref = searchParams.get("from") || "/classes";

  const resolvedParams = use(params);
  const classId = resolvedParams?.id;

  const {
    classDetail,
    students,
    courses,
    loading,
    isError,
    savingClass,
    updatingEnrollmentId,
    saveClassMeta,
    changeStudentStatus,
    refresh,
  } = useClassDetail(classId);

  if (loading) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading class details...
      </div>
    );
  }

  if (isError || !classDetail) {
    return (
      <div className="p-8 text-center text-text-muted">
        Class not found or failed to load.
      </div>
    );
  }

  return (
    <DetailFrame
      backHref={backHref}
      title={
        <>
          {classDetail.name}
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-primary-light text-brand-primary border border-brand-primary/20">
            {classDetail.class_status}
          </span>
        </>
      }
      description={`Course: ${classDetail.course_title} (${classDetail.course_code})`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <ClassDetailCard
            classDetail={classDetail}
            courses={courses}
            saving={savingClass}
            onSave={saveClassMeta}
          />
        </div>

        <div className="lg:col-span-2">
          <EnrolledStudentsTable
            classId={Number(classId)}
            classStatus={classDetail?.class_status}
            students={students}
            updatingId={updatingEnrollmentId}
            onStatusChange={changeStudentStatus}
            onRefresh={refresh}
            onItemClick={(studentId) =>
              router.push(`/students/${studentId}?from=/classes/${classId}`)
            }
          />
        </div>
      </div>
    </DetailFrame>
  );
}
