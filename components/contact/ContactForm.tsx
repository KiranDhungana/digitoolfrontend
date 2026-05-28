"use client";

import { CheckCircle2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { submitContactMessage } from "@/lib/api/contact";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || "").trim();
    const message = String(form.get("message") || "").trim();

    try {
      const result = await submitContactMessage({
        name,
        email,
        subject: subject || undefined,
        message,
      });
      setSuccessMessage(result.message);
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        <h2 className="mt-4 text-lg font-bold text-gray-900">Message sent</h2>
        <p className="mt-2 text-sm text-gray-600">{successMessage}</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setSent(false);
            setSuccessMessage("");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <Input label="Your name" name="name" required autoComplete="name" />
      <Input
        label="Your email"
        name="email"
        type="email"
        required
        autoComplete="email"
      />
      <Input
        label="Subject"
        name="subject"
        placeholder="Order help, product question, etc."
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          placeholder="How can we help?"
        />
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="secondary"
        className="w-full py-3"
        disabled={submitting}
      >
        <Mail className="h-4 w-4" />
        {submitting ? "Sending…" : "Send message"}
      </Button>
      <p className="text-center text-xs text-gray-500">
        We will review your message and reply to your email.
      </p>
    </form>
  );
}
