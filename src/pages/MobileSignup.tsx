import { motion } from "framer-motion";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../services/api";
import toast from "react-hot-toast";

type SignupForm = {
  name: string;
  email: string;
  password: string;
};

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

const initialForm: SignupForm = {
  name: "",
  email: "",
  password: "",
};

function validateSignupForm(form: SignupForm) {
  const errors: SignupErrors = {};
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();
  const trimmedPassword = form.password.trim();

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

  if (!trimmedPassword) {
    errors.password = "Password is required.";
  } else if (trimmedPassword.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(trimmedPassword)) {
    errors.password = "Use letters and at least one number.";
  }

  return errors;
}

function MobileSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof SignupForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateSignupForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      };
      const response = await createUser(payload);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        navigate("/");
      }

      setForm(initialForm);
    } catch {
      toast.error("Unable to create account. Please try again.");
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
          <Link
            to="/"
            className="font-space-grotesk text-xl font-bold tracking-normal"
          >
            sortMyScene
          </Link>
        </motion.header>

        <motion.form
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.55 }}
          onSubmit={handleSignupSubmit}
          noValidate
          className="relative z-10 mt-8 rounded-[2rem] bg-white p-5 shadow-[0_24px_80px_rgba(26,27,35,0.18)]"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Sign up</p>
              <h2 className="font-space-grotesk text-2xl font-bold tracking-normal">
                Create your account
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Full name
              </span>
              <span
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                  errors.name
                    ? "border-red-400"
                    : "border-seat-gray1 focus-within:border-primary"
                }`}
              >
                <FiUser
                  className={errors.name ? "text-red-500" : "text-primary"}
                />
                <input
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-seat-gray2"
                  placeholder="Aarav Sharma"
                  autoComplete="name"
                />
              </span>
              {errors.name && (
                <span className="mt-2 block text-xs font-semibold text-red-500">
                  {errors.name}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                Email address
              </span>
              <span
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                  errors.email
                    ? "border-red-400"
                    : "border-seat-gray1 focus-within:border-primary"
                }`}
              >
                <FiMail
                  className={errors.email ? "text-red-500" : "text-primary"}
                />
                <input
                  value={form.email}
                  onChange={(event) =>
                    handleChange("email", event.target.value)
                  }
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-seat-gray2"
                  placeholder="you@example.com"
                  type="email"
                  autoComplete="email"
                />
              </span>
              {errors.email && (
                <span className="mt-2 block text-xs font-semibold text-red-500">
                  {errors.email}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <span
                className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition ${
                  errors.password
                    ? "border-red-400"
                    : "border-seat-gray1 focus-within:border-primary"
                }`}
              >
                <FiLock
                  className={errors.password ? "text-red-500" : "text-primary"}
                />
                <input
                  value={form.password}
                  onChange={(event) =>
                    handleChange("password", event.target.value)
                  }
                  className="w-full bg-transparent text-base font-medium outline-none placeholder:text-seat-gray2"
                  placeholder="8+ characters"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((currentValue) => !currentValue)
                  }
                  className="text-seat-gray2 transition hover:text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </span>
              {errors.password && (
                <span className="mt-2 block text-xs font-semibold text-red-500">
                  {errors.password}
                </span>
              )}
            </label>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="mt-6 cursor-pointer flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 text-base font-bold text-white shadow-[0_16px_36px_rgba(124,58,237,0.32)] transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
            <FiArrowRight />
          </motion.button>

          <p className="mt-5 text-center text-sm text-text/60">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary">
              Log in
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
            <div
              key={scene}
              className="rounded-2xl border border-seat-gray1 bg-white px-3 py-3 text-center shadow-sm"
            >
              <p className="text-xs font-bold text-text/70">{scene}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

export default MobileSignup;
