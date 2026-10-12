import { useState } from "react";
import { createPayment, updatePaymentStatus } from "@/services/paymentService";
import { CreatePaymentPayload } from "@/types/payment";

export function usePaymentMutations(onSuccess?: () => void) {
  const [submitting, setSubmitting] = useState(false);

  const handleCreatePayment = async (payload: CreatePaymentPayload) => {
    setSubmitting(true);
    try {
      const res = await createPayment(payload);
      if (res.success && onSuccess) {
        onSuccess();
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: "Paid" | "Refunded",
  ) => {
    setSubmitting(true);
    try {
      const res = await updatePaymentStatus(id, status);
      if (res.success && onSuccess) {
        onSuccess();
      }
      return res;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    createPayment: handleCreatePayment,
    updatePaymentStatus: handleUpdateStatus,
  };
}
