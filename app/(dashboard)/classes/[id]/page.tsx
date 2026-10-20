"use client";

import { ClassDetailCard } from "@/components/classes/ClassDetailCard";
import { ClassScheduleSection } from "@/components/classes/ClassScheduleSection";
import { EnrollStudentsModal } from "@/components/classes/EnrollStudentsModal";
import DataTable, { Column } from "@/components/ui/DataTable";
import DetailFrame from "@/components/ui/DetailFrame";
import { useClassDetail } from "@/hooks/classes";
import { useCourses } from "@/hooks/courses/useCourses";
import { ClassEnrolledStudent, EnrollmentStatus } from "@/types/class";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";

const PAGE_SIZE = 10;

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

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const isCompleted = classDetail?.class_status === "Completed";
  const totalItems = students.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [students.length, totalPages, currentPage]);

  const paginatedStudents = students.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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

  const columns: Column<ClassEnrolledStudent>[] = [
    {
      header: "Name",
      accessorKey: "name",
      className: "font-medium text-text-main",
    },
    {
      header: "Contact",
      render: (st) => (
        <div>
          <div>{st.email}</div>
          <div className="text-[11px] text-text-dim">{st.phone}</div>
        </div>
      ),
    },
    {
      header: "Enrolled Date",
      accessorKey: "enrolled_date",
    },
    {
      header: "Status",
      render: (st) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            disabled={updatingEnrollmentId === st.enrollment_id}
            value={st.enrollment_status}
            onChange={(e) =>
              changeStudentStatus(
                st.enrollment_id,
                e.target.value as EnrollmentStatus,
              )
            }
            className="bg-surface-hover border border-border-main text-xs text-text-main font-medium rounded-xl px-2.5 py-1 focus:outline-none focus:border-brand-primary disabled:opacity-50 cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Promoted">Promoted</option>
            <option value="Graduated">Graduated</option>
            <option value="Demoted">Demoted</option>
            <option value="Dropped">Dropped</option>
          </select>
        </div>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (st) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={updatingEnrollmentId === st.enrollment_id}
            onClick={() => changeStudentStatus(st.enrollment_id, "Dropped")}
            className="inline-flex items-center gap-1 text-xs text-status-danger hover:text-rose-700 font-medium px-2.5 py-1 rounded-lg hover:bg-status-danger/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

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
      <div className="flex flex-col h-auto lg:h-[calc(100vh-180px)] space-y-6">
        <div className="shrink-0">
          <ClassDetailCard
            classDetail={classDetail}
            courses={courses}
            saving={savingClass}
            onSave={saveClassMeta}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:flex-1 lg:min-h-0 items-stretch">
          <div className="h-auto lg:h-full flex flex-col">
            <DataTable
              data={paginatedStudents}
              columns={columns}
              keyExtractor={(st) => st.enrollment_id}
              emptyMessage="No students enrolled in this class yet."
              title={`Enrolled Students (${totalItems})`}
              actionButton={{
                label: "Enroll Students",
                onClick: () => setIsModalOpen(true),
                icon: <FaUserPlus className="text-[11px]" />,
                disabled: isCompleted,
              }}
              pagination={{
                currentPage,
                totalPages,
                onPageChange: (page) => setCurrentPage(page),
                totalItems,
                pageSize: PAGE_SIZE,
              }}
              onItemClick={(st) =>
                router.push(
                  `/students/${st.student_id}?from=/classes/${classId}`,
                )
              }
            />
          </div>

          <ClassScheduleSection classId={classId} classDetail={classDetail} />
        </div>
      </div>

      <EnrollStudentsModal
        classId={Number(classId)}
        isOpen={isModalOpen && !isCompleted}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </DetailFrame>
  );
}
