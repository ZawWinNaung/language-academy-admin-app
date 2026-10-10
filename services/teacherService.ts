import { PaginatedApiResponse } from "@/types/common";
import { Teacher } from "@/types/teacher";

export async function fetchTeachers(
  search = "",
  page = 1,
  limit = 15,
): Promise<PaginatedApiResponse<Teacher[]>> {
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("search", search);
  searchParams.set("page", String(page));
  searchParams.set("limit", String(limit));

  const res = await fetch(`/api/teachers?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch teachers");
  return res.json();
}
