import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { adminService } from "@/services/adminService";
import LoginPage from "./page";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("@/services/adminService", () => ({
  adminService: { login: vi.fn() },
}));

const loginMock = vi.mocked(adminService.login);

afterEach(cleanup);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("LoginPage", () => {
  it("submits the credentials and navigates after successful login", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({ success: true });
    render(<LoginPage />);

    await user.type(
      screen.getByPlaceholderText("admin@cambridge-academy.edu"),
      "admin@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Login →" }));

    await waitFor(() => expect(push).toHaveBeenCalledWith("/dashboard"));
    expect(loginMock).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "password123",
    });
  });

  it("shows the authentication error without navigating", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue({
      success: false,
      message: "Invalid email or password",
    });
    render(<LoginPage />);

    await user.type(
      screen.getByPlaceholderText("admin@cambridge-academy.edu"),
      "admin@example.com",
    );
    await user.type(
      screen.getByPlaceholderText("••••••••••••"),
      "wrongpassword",
    );
    await user.click(screen.getByRole("button", { name: "Login →" }));

    expect(await screen.findByText(/Invalid email or password/)).toBeVisible();
    expect(push).not.toHaveBeenCalled();
  });

  it("disables the submit button while login is pending", async () => {
    const user = userEvent.setup();
    let resolveLogin!: (result: { success: boolean }) => void;
    loginMock.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    render(<LoginPage />);

    await user.type(
      screen.getByPlaceholderText("admin@cambridge-academy.edu"),
      "admin@example.com",
    );
    await user.type(screen.getByPlaceholderText("••••••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Login →" }));

    expect(screen.getByRole("button", { name: /Signing In/ })).toBeDisabled();
    resolveLogin({ success: true });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Login →" })).toBeEnabled(),
    );
  });
});
