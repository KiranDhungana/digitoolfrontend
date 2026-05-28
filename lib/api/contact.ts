import { API_URL } from "@/lib/api/config";

export interface SubmitContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function submitContactMessage(
  payload: SubmitContactPayload
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Could not send message"
    );
  }
  return data as { ok: boolean; message: string };
}
