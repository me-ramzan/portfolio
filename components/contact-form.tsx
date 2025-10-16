"use client";

import { useState, useRef } from "react";
import emailjs from "emailjs-com";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
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
    
    //validate email
    if (!validateEmail(form.email)) {
      setFormErrors({ email: "Please enter a valid email address" });
      return;
    }

    setStatus({ type: "sending", text: "Sending..." });

    try {
      
      await emailjs.sendForm(
        'default_service',  
        'template_ixuq35o', 
        formRef.current!,   
        'ehdE9q289VbqNO4oU' //public key
      );

      setForm({ name: "", email: "", phone: "", message: "" });
      setFormErrors({});
      setStatus({ type: "ok", text: "Message sent, thank you!" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "error", text: "Failed to send. Please try again later." });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Full Name"
        className="w-full border rounded p-2 placeholder:text-sm"
      />
      
      {/* Email and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Email"
            className={`w-full border rounded p-2 placeholder:text-sm ${
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
          placeholder="Phone number (Optional)"
          className="w-full border rounded p-2 placeholder:text-sm"
        />
      </div>

      {/* Message */}
      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        placeholder="Message"
        className="w-full border rounded p-2 placeholder:text-sm"
      />
      
      {/* Submit/status button */}
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