"use client";

import { useState } from "react";
import emailjs from "emailjs-com";

export default function ContactForm() {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "" 
  });
  const [formErrors, setFormErrors] = useState<{email?: string}>({});
  const [status, setStatus] = useState<{ type: "idle" | "sending" | "ok" | "error"; text?: string }>({
    type: "idle",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear email error when user starts typing
    if (name === "email" && formErrors.email) {
      setFormErrors({});
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!validateEmail(form.email)) {
      setFormErrors({ email: "Please enter a valid email address" });
      return;
    }

    setStatus({ type: "sending", text: "Sending..." });

    try {
      // 🚀 Use your actual EmailJS IDs here
      await emailjs.send(
        "service_9n4aoyg",   // replace with your EmailJS service ID
        "OxMGSntEbVODybgCyPxSu",  // replace with your EmailJS template ID
        {
          from_name: form.name,
          from_email: form.email,
          from_phone: form.phone, // Make sure your EmailJS template has this variable
          message: form.message,
        },
        "ehdE9q289VbqNO4oU"    // replace with your EmailJS public key
      );

      setForm({ name: "", email: "", phone: "", message: "" });
      setFormErrors({});
      setStatus({ type: "ok", text: "Message sent — thank you!" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", text: "Failed to send. Please try again later." });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Full Name"
        className="w-full border rounded p-2"
      />
      
      {/* Email and Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className={`w-full border rounded p-2 ${
              formErrors.email ? "border-red-500" : ""
            }`}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>
        
        <input
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded p-2"
          placeholder="Phone number (Optional)"
        />
      </div>

      {/* Message Field */}
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        placeholder="Message"
        className="w-full border rounded p-2"
      />
      
      {/* Submit Button and Status */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={status.type === "sending"}
        >
          {status.type === "sending" ? "Sending…" : "Send"}
        </button>
        {status.type !== "idle" && (
          <p
            className={`text-sm ${
              status.type === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {status.text}
          </p>
        )}
      </div>
    </form>
  );
}