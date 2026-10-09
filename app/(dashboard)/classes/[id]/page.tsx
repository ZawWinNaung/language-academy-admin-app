"use client";

import React, { use } from "react";
import { useClassDetail } from "@/hooks/classes";
import { useCourses } from "@/hooks/useCourses";
import { ClassDetailCard } from "@/components/classes/ClassDetailCard";
import { EnrolledStudentsTable } from "@/components/classes/EnrolledStudentsTable";
import { ClassScheduleSection } from "@/components/classes/ClassScheduleSection";
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
    loading,
    isError,
    savingClass,
    updatingEnrollmentId,
    saveClassMeta,
    changeStudentStatus,
    refresh,
  } = useClassDetail(classId);

  const {
    courses,
    loading: coursesLoading,
    isError: coursesError,
  } = useCourses({});

  if (loading || coursesLoading) {
    return (
      <div className="p-8 text-center text-text-muted">
        Loading class details...
      </div>
    );
  }

  if (isError || coursesError || !classDetail) {
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
      {/* Mobile: Standard natural block height | Desktop: Fixed Viewport Height */}
      <div className="flex flex-col h-auto lg:h-[calc(100vh-180px)] space-y-6">
        {/* Top Full-Width Class Detail Strip */}
        <div className="shrink-0">
          <ClassDetailCard
            classDetail={classDetail}
            courses={courses}
            saving={savingClass}
            onSave={saveClassMeta}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:flex-1 lg:min-h-0 items-stretch">
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
            onRemoveStudent={() => {}}
          />

          <ClassScheduleSection classId={classId} />
        </div>
      </div>
    </DetailFrame>
  );
}
