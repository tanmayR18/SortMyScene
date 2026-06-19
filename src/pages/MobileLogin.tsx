import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import { FiArrowRight, FiMail, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";

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

function MobileLogin() {
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
    <main className="relative min-h-screen overflow-hidden bg-background font-inter text-text">
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,#7c3aed_0%,#ec4899_52%,#f59e0b_100%)]" />
      <div className="absolute left-6 top-16 h-28 w-28 rounded-full border border-white/30 bg-white/10 blur-sm" />
      <div className="absolute right-0 top-28 h-24 w-24 rounded-full bg-white/15 blur-2xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 flex items-center justify-between text-white"
        >
          <Link to="/" className="font-space-grotesk text-xl font-bold tracking-normal">
            sortMyScene
          </Link>
        </motion.header>

        <motion.form
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          onSubmit={handleLoginSubmit}
          noValidate
          className="relative z-10 mt-8 rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(26,27,35,0.18)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Log in</p>
              <h2 className="font-space-grotesk text-2xl font-bold tracking-normal">Welcome back</h2>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Full name</span>
              <span
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                  errors.name ? "border-red-400" : "border-seat-gray1 focus-within:border-primary"
                }`}
              >
                <FiUser className={errors.name ? "text-red-500" : "text-primary"} />
                <input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-seat-gray2"
                  placeholder="Aarav Sharma"
                  autoComplete="name"
                />
              </span>
              {errors.name && <span className="mt-2 block text-xs font-semibold text-red-500">{errors.name}</span>}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email address</span>
              <span
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                  errors.email ? "border-red-400" : "border-seat-gray1 focus-within:border-primary"
                }`}
              >
                <FiMail className={errors.email ? "text-red-500" : "text-primary"} />
                <input
                  value={form.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-seat-gray2"
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
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(124,58,237,0.32)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
            <FiArrowRight />
          </motion.button>

          <p className="mt-5 text-center text-sm text-text/60">
            New to sortMyScene?{" "}
            <Link to="/signup" className="font-bold text-primary">
              Create an account
            </Link>
          </p>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.5 }}
          className="relative z-10 mt-5 grid grid-cols-3 gap-3 pb-4"
        >
          {["Concerts", "Standup", "Movies"].map((scene) => (
            <div key={scene} className="rounded-2xl border border-seat-gray1 bg-white px-3 py-3 text-center shadow-sm">
              <p className="text-xs font-bold text-text/70">{scene}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

export default MobileLogin;
