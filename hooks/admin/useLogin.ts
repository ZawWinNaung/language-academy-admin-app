"use client";

import { useState } from "react";
import { adminService } from "@/services/adminService";
import { LoginCredentials } from "@/types/admin";

export function useLogin() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsAuthenticating(true);
    setErrorMessage("");

    try {
      const result = await adminService.login(credentials);
      if (result.success) return true;

      setErrorMessage(result.message || "Invalid credentials provided.");
      return false;
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  return { isAuthenticating, errorMessage, login };
}
