import { useState } from "react";
import useSWR from "swr";
import {
  fetchTeacherDetail,
  updateTeacherDetail,
} from "@/services/teacherService";

export function useTeacherDetail(teacherId: string | number | undefined) {
  const cacheKey = teacherId ? ["teacher-detail", String(teacherId)] : null;

  const { data, error, isLoading, mutate } = useSWR(cacheKey, () =>
    teacherId ? fetchTeacherDetail(teacherId) : null,
  );

  const [savingProfile, setSavingProfile] = useState(false);

  const teacher = data?.data?.teacher ?? null;

  const saveProfile = async (
    profileData: any,
  ): Promise<{ success: boolean; message?: string }> => {
    if (!teacherId)
      return { success: false, message: "Teacher ID is missing." };

    try {
      setSavingProfile(true);
      const res = await updateTeacherDetail(teacherId, profileData);

      if (res.success) {
        await mutate();
        return { success: true };
      }
      return {
        success: false,
        message: res.message || "Failed to update profile.",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "An unexpected error occurred.",
      };
    } finally {
      setSavingProfile(false);
    }
  };

  return {
    teacher,
    loading: isLoading,
    isError: Boolean(error),
    savingProfile,
    saveProfile,
    refreshTeacher: mutate,
  };
}
