import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminService } from "@/services/adminService";
import { useAdminPassword } from "@/hooks/admin/useAdminPassword";
import AdminPasswordCard from "./AdminPasswordCard";

vi.mock("@/services/adminService", () => ({
  adminService: { updatePassword: vi.fn() },
}));

const updatePasswordMock = vi.mocked(adminService.updatePassword);

function AdminPasswordForm() {
  const {
    formData,
    setFormData,
    updating,
    message,
    setMessage,
    handleUpdate,
  } = useAdminPassword();

  return (
    <AdminPasswordCard
      passwordData={formData}
      setPasswordData={setFormData}
      updating={updating}
      message={message}
      setMessage={setMessage}
      onSubmit={handleUpdate}
    />
  );
}

async function fillPasswordForm(
  user: ReturnType<typeof userEvent.setup>,
  newPassword: string,
  confirmPassword = newPassword,
) {
  await user.type(screen.getByLabelText("Current Password"), "current-pass");
  await user.type(screen.getByLabelText("New Password"), newPassword);
  await user.type(
    screen.getByLabelText("Confirm New Password"),
    confirmPassword,
  );
}

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AdminPasswordCard", () => {
  it("updates the password and clears the form after success", async () => {
    const user = userEvent.setup();
    updatePasswordMock.mockResolvedValue({ success: true });
    render(<AdminPasswordForm />);

    await fillPasswordForm(user, "new-password");
    await user.click(
      screen.getByRole("button", { name: "Update Password" }),
    );

    expect(updatePasswordMock).toHaveBeenCalledWith({
      current_password: "current-pass",
      new_password: "new-password",
    });
    expect(await screen.findByText("Password updated successfully!")).toBeVisible();
    expect(screen.getByLabelText("Current Password")).toHaveValue("");
    expect(screen.getByLabelText("New Password")).toHaveValue("");
    expect(screen.getByLabelText("Confirm New Password")).toHaveValue("");
  });

  it("does not call the service when new password confirmation differs", async () => {
    const user = userEvent.setup();
    render(<AdminPasswordForm />);

    await fillPasswordForm(user, "new-password", "different-password");
    await user.click(
      screen.getByRole("button", { name: "Update Password" }),
    );

    expect(
      await screen.findByText("New passwords do not match."),
    ).toBeVisible();
    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  it("shows the server error and keeps the entered password values", async () => {
    const user = userEvent.setup();
    updatePasswordMock.mockResolvedValue({
      success: false,
      message: "Current password is incorrect.",
    });
    render(<AdminPasswordForm />);

    await fillPasswordForm(user, "new-password");
    await user.click(
      screen.getByRole("button", { name: "Update Password" }),
    );

    expect(
      await screen.findByText("Current password is incorrect."),
    ).toBeVisible();
    expect(screen.getByLabelText("Current Password")).toHaveValue("current-pass");
    expect(screen.getByLabelText("New Password")).toHaveValue("new-password");
    expect(
      screen.getByLabelText("Confirm New Password"),
    ).toHaveValue("new-password");
  });
});
