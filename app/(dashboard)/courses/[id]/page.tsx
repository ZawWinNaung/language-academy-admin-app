"use client";

import React, { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DetailFrame from "@/components/ui/DetailFrame";
import CourseDetailCard from "@/components/courses/CourseDetailCard";
import CourseClassesTable from "@/components/courses/CourseClassesTable";
import { useCourseDetail } from "@/hooks/useCourseDetail";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const backHref = searchParams.get("from") || "/courses";

  const {
    course,
    courseLoading,
    classes,
    classesLoading,
    pagination,
    setClassPage,
    submitting,
    handleUpdateCourse,
  } = useCourseDetail(id);

  if (courseLoading) {
    return (
      <DetailFrame backHref={backHref} title="Loading Course..." description="">
        <div className="p-8 text-center text-text-muted">
          Loading course details...
        </div>
      </DetailFrame>
    );
  }

  if (!course) {
    return (
      <DetailFrame backHref={backHref} title="Course Not Found" description="">
        <div className="p-8 text-center text-text-muted">
          Course not found or failed to load.
        </div>
      </DetailFrame>
    );
  }

  return (
    <DetailFrame
      backHref={backHref}
      title={course.title}
      description={`Course Code: ${course.code}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <CourseDetailCard
            course={course}
            submitting={submitting}
            onUpdate={handleUpdateCourse}
          />
        </div>

        <div className="lg:col-span-2">
          <CourseClassesTable
            classes={classes}
            loading={classesLoading}
            pagination={pagination}
            onPageChange={setClassPage}
            onItemClick={(classId) =>
              router.push(`/classes/${classId}?from=/courses/${id}`)
            }
          />
        </div>
      </div>
    </DetailFrame>
  );
}
