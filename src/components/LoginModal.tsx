import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import { FiArrowRight, FiMail, FiUser, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

type LoginModalProps = {
  onClose?: () => void;
};

type LoginForm = {
  name: string;
  email: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
  name: "",
  email: "",
};

function validateLoginForm(form: LoginForm) {
  const errors: LoginErrors = {};
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();

  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function LoginModal({ onClose }: LoginModalProps) {
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof LoginForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("/api/auth/login", {
        name: form.name.trim(),
        email: form.email.trim(),
      });

      setForm(initialForm);
    } catch {
      setErrors({
        email: "Login failed. Please check your details and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-5 py-8 font-inter backdrop-blur-sm">
      <motion.form
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onSubmit={handleLoginSubmit}
        noValidate
        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 text-text shadow-[0_24px_90px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
      >
        <div className="relative z-10 mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Log in</p>
            <h2 className="mt-1 font-space-grotesk text-3xl font-bold tracking-normal">Welcome back</h2>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-seat-gray1 bg-white/70 text-text transition hover:border-primary hover:text-primary"
              aria-label="Close login modal"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="relative z-10 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text">Full name</span>
            <span
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                errors.name
                  ? "border-red-400 bg-white"
                  : "border-seat-gray1 bg-white focus-within:border-primary"
              }`}
            >
              <FiUser className={errors.name ? "text-red-500" : "text-primary"} />
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                className="w-full bg-transparent text-base font-medium text-text outline-none placeholder:text-seat-gray2"
                placeholder="Aarav Sharma"
                autoComplete="name"
              />
            </span>
            {errors.name && <span className="mt-2 block text-xs font-semibold text-red-500">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text">Email address</span>
            <span
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                errors.email
                  ? "border-red-400 bg-white"
                  : "border-seat-gray1 bg-white focus-within:border-primary"
              }`}
            >
              <FiMail className={errors.email ? "text-red-500" : "text-primary"} />
              <input
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                className="w-full bg-transparent text-base font-medium text-text outline-none placeholder:text-seat-gray2"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
            </span>
            {errors.email && <span className="mt-2 block text-xs font-semibold text-red-500">{errors.email}</span>}
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="relative z-10 mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(124,58,237,0.35)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
          <FiArrowRight />
        </motion.button>

        <p className="relative z-10 mt-5 text-center text-sm text-text/60">
          New to sortMyScene?{" "}
          <Link to="/signup" className="font-bold text-primary">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default LoginModal;
