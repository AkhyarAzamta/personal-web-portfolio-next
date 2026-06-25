"use client";

import React, { useState, FormEvent, useRef } from "react";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface FieldError {
  name?: string;
  email?: string;
  message?: string;
}

// Tipe untuk respons error dari Laravel
interface LaravelErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const formRef = useRef<HTMLFormElement>(null);

  // Reset status & errors saat user mulai mengetik
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FieldError]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status.type) {
      setStatus({ type: null, message: "" });
    }
  };

  // Validasi client-side
  const validate = (): boolean => {
    const newErrors: FieldError = {};
    const { name, email, message } = formData;

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!message.trim() || message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus({ type: null, message: "" });

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LaravelErrorResponse = await response.json();

      if (response.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message ?? "Message transmitted successfully.",
        });
        setFormData({ name: "", email: "", message: "" });
        formRef.current?.reset();
      } else {
        // Handle Laravel validation errors (422)
        if (response.status === 422 && data.errors) {
          const fieldErrors: FieldError = {};
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (messages.length > 0) {
              fieldErrors[field as keyof FieldError] = messages[0];
            }
          });
          setErrors(fieldErrors);
        } else {
          setStatus({
            type: "error",
            message: data.message ?? "Transmission failed. Please try again.",
          });
        }
      }
    } catch {
      setStatus({
        type: "error",
        message: "Connection lost. Check your network and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mt-20 pb-20 md:mt-32 md:pb-32" id="contact">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 md:mb-12">
        <span className="font-headline-md text-xl md:text-headline-md text-on-surface">
          CONTACT_UPLINK
        </span>
        <div className="grow h-px bg-white/10 relative">
          <div className="absolute top-0 left-0 h-full w-1/4 bg-neon-cyan blur-[2px]" />
        </div>
      </div>

      {/* Form container */}
      <div className="max-w-3xl mx-auto bg-background-surface/80 border border-white/20 p-6 md:p-8 neon-glow-cyan relative">
        {/* Sudut dekoratif */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-neon-cyan" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-neon-cyan" />

        {/* Header terminal */}
        <div className="flex items-center gap-2 mb-6 md:mb-8 border-b border-white/10 pb-4">
          <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-neon-cyan animate-pulse" />
          <span className="font-label-sm text-[10px] md:text-label-sm text-terminal-gray uppercase tracking-widest">
            Secure Terminal Session: 0x4492
          </span>
        </div>

        {/* Status message */}
        {status.type && (
          <div
            className={`mb-6 p-3 border font-code-md text-xs md:text-sm flex items-start gap-2 ${
              status.type === "success"
                ? "border-neon-cyan text-neon-cyan bg-neon-cyan/5"
                : "border-red-400 text-red-400 bg-red-400/5"
            }`}
          >
            <span className="mt-px">{status.type === "success" ? "✓" : "✗"}</span>
            <span>{status.message}</span>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Field: Name */}
          <div className="group">
            <label
              htmlFor="name"
              className="block font-code-md text-xs md:text-code-md text-neon-cyan mb-1 md:mb-2"
            >
              &gt; ENTER_NAME
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John_Doe_v1"
              className="w-full bg-background-deep border-b border-white/20 py-2 px-3 md:py-3 md:px-4 font-code-md text-[13px] md:text-base text-on-surface focus:border-neon-cyan transition-colors duration-300 placeholder:text-terminal-gray/30 outline-none"
              required
            />
            {errors.name && (
              <p className="font-code-md text-[10px] text-red-400 mt-1">
                &#x2044; ERROR: {errors.name}
              </p>
            )}
          </div>

          {/* Field: Email */}
          <div className="group">
            <label
              htmlFor="email"
              className="block font-code-md text-xs md:text-code-md text-neon-cyan mb-1 md:mb-2"
            >
              &gt; ENTER_EMAIL
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="uplink@network.io"
              className="w-full bg-background-deep border-b border-white/20 py-2 px-3 md:py-3 md:px-4 font-code-md text-[13px] md:text-base text-on-surface focus:border-neon-cyan transition-colors duration-300 placeholder:text-terminal-gray/30 outline-none"
              required
            />
            {errors.email && (
              <p className="font-code-md text-[10px] text-red-400 mt-1">
                &#x2044; ERROR: {errors.email}
              </p>
            )}
          </div>

          {/* Field: Message */}
          <div className="group">
            <label
              htmlFor="message"
              className="block font-code-md text-xs md:text-code-md text-neon-cyan mb-1 md:mb-2"
            >
              &gt; MESSAGE_BODY
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Awaiting protocol details..."
              className="w-full bg-background-deep border-b border-white/20 py-2 px-3 md:py-3 md:px-4 font-code-md text-[13px] md:text-base text-on-surface focus:border-neon-cyan transition-colors duration-300 placeholder:text-terminal-gray/30 min-h-25 md:min-h-37.5 outline-none resize-none"
              required
            />
            {errors.message && (
              <p className="font-code-md text-[10px] text-red-400 mt-1">
                &#x2044; ERROR: {errors.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="relative bg-neon-cyan text-background font-label-sm text-[10px] md:text-label-sm uppercase tracking-[0.3em] px-6 py-3 md:px-10 md:py-4 hover:neon-glow-cyan-hover transition-all duration-300 active:scale-95 group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    TRANSMITTING...
                  </>
                ) : (
                  "TRANSMIT_DATA"
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}