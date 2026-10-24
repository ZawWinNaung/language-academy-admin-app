import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStudents } from "@/hooks/students/useStudents";
import { createStudent } from "@/services/studentService";
import AddStudentModal from "./AddStudentModal";

vi.mock("swr", () => ({
  default: () => ({
    data: { data: [], pagination: { totalItems: 0, totalPages: 1, pageSize: 20 } },
    error: undefined,
    isLoading: false,
    mutate: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("@/services/studentService", () => ({
  fetchStudentsList: vi.fn(),
  createStudent: vi.fn(),
}));

const createStudentMock = vi.mocked(createStudent);

function AddStudentForm() {
  const { formData, setFormData, submitting, handleCreateStudent } =
    useStudents();

  return (
    <AddStudentModal
      isOpen
      onClose={vi.fn()}
      onSubmit={(event) => {
        event.preventDefault();
        void handleCreateStudent();
      }}
      formData={formData}
      setFormData={setFormData}
      submitting={submitting}
    />
  );
}

async function fillStudentForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full Name"), "Aung Kyaw Thu");
  await user.type(
    screen.getByLabelText("Email Address"),
    "aung@example.com",
  );
  await user.type(screen.getByLabelText("Phone Number"), "+959450011223");
  await user.type(screen.getByLabelText("Joined Date"), "2026-10-24");
}

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AddStudentModal", () => {
  it("creates a student and clears the form after success", async () => {
    const user = userEvent.setup();
    createStudentMock.mockResolvedValue({ success: true, data: { id: 1 } });
    render(<AddStudentForm />);

    await fillStudentForm(user);
    await user.click(screen.getByRole("button", { name: "Save Student" }));

    expect(createStudentMock).toHaveBeenCalledWith({
      name: "Aung Kyaw Thu",
      email: "aung@example.com",
      phone: "+959450011223",
      joined_date: "2026-10-24",
    });
    expect(screen.getByLabelText("Full Name")).toHaveValue("");
    expect(screen.getByLabelText("Email Address")).toHaveValue("");
    expect(screen.getByLabelText("Phone Number")).toHaveValue("");
    expect(screen.getByLabelText("Joined Date")).toHaveValue("");
  });

  it("preserves entered details when the API rejects creation", async () => {
    const user = userEvent.setup();
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    createStudentMock.mockResolvedValue({
      success: false,
      message: "A student with this email already exists.",
    });
    render(<AddStudentForm />);

    await fillStudentForm(user);
    await user.click(screen.getByRole("button", { name: "Save Student" }));

    expect(alertMock).toHaveBeenCalledWith(
      "A student with this email already exists.",
    );
    expect(screen.getByLabelText("Full Name")).toHaveValue("Aung Kyaw Thu");
    expect(screen.getByLabelText("Email Address")).toHaveValue(
      "aung@example.com",
    );
    expect(screen.getByLabelText("Phone Number")).toHaveValue("+959450011223");
    expect(screen.getByLabelText("Joined Date")).toHaveValue("2026-10-24");
    alertMock.mockRestore();
  });

  it("disables submission while the student is being created", async () => {
    const user = userEvent.setup();
    let resolveCreate!: (
      response: { success: boolean; data?: { id: number } },
    ) => void;
    createStudentMock.mockReturnValue(
      new Promise((resolve) => {
        resolveCreate = resolve;
      }),
    );
    render(<AddStudentForm />);

    await fillStudentForm(user);
    await user.click(screen.getByRole("button", { name: "Save Student" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    resolveCreate({ success: true, data: { id: 1 } });

    expect(
      await screen.findByRole("button", { name: "Save Student" }),
    ).toBeEnabled();
  });
});
