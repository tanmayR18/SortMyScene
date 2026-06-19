
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
};

const hasStoredToken = () => Boolean(localStorage.getItem("token")?.trim());

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken);
  const [activeAuthModal, setActiveAuthModal] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch {
          // Invalid JSON, ignore
        }
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasStoredToken());
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-background font-inter text-text pb-28">
        <header className="sticky top-0 z-30 border-b border-seat-gray1 bg-white/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[0_14px_30px_rgba(124,58,237,0.28)]">
                <FaTicketAlt />
              </span>
              <span>
                <span className="block font-space-grotesk text-xl font-bold tracking-normal">
                  SortMyScene
                </span>
                <span className="hidden text-xs font-semibold text-text/55 sm:block">
                  Discover events near you
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="hidden cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-text transition hover:text-primary md:block"
                onClick={() => setActiveAuthModal("login")}
                type="button"
              >
                Log in
              </button>
              <button
                className="hidden cursor-pointer rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(124,58,237,0.26)] transition hover:bg-primary-hover md:block"
                onClick={() => setActiveAuthModal("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>
          </nav>
        </header>

        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
            <p className="mb-3 text-lg font-semibold">Please log in to view your profile</p>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white"
              onClick={() => setActiveAuthModal("login")}
              type="button"
            >
              Log in
            </button>
          </div>
        </section>

        {activeAuthModal === "login" && (
          <LoginModal
            onClose={() => setActiveAuthModal(null)}
            onSuccess={() => {
              setIsAuthenticated(true);
              setActiveAuthModal(null);
            }}
            onSwitchToSignup={() => setActiveAuthModal("signup")}
          />
        )}
        {activeAuthModal === "signup" && (
          <SignupModal
            onClose={() => setActiveAuthModal(null)}
            onSuccess={() => {
              setIsAuthenticated(true);
              setActiveAuthModal(null);
            }}
            onSwitchToLogin={() => setActiveAuthModal("login")}
          />
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background font-inter text-text pb-28">
      <header className="sticky top-0 z-30 border-b border-seat-gray1 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[0_14px_30px_rgba(124,58,237,0.28)]">
              <FaTicketAlt />
            </span>
            <span>
              <span className="block font-space-grotesk text-xl font-bold tracking-normal">
                SortMyScene
              </span>
              <span className="hidden text-xs font-semibold text-text/55 sm:block">
                Discover events near you
              </span>
            </span>
          </Link>

          <Link
            aria-label="Go to profile"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-seat-gray1 bg-white text-2xl text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
            to="/profile"
          >
            <FaUserCircle />
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary-hover text-3xl font-bold text-white shadow-lg">
              {getInitial(user.name)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-space-grotesk font-bold">{user.name}</h1>
              <p className="text-text/60">{user.email}</p>
            </div>
          </div>

          <div className="mb-8 border-t border-seat-gray1 pt-8">
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:bg-primary-hover"
            >
              My Bookings
            </Link>
          </div>

          <div className="border-t border-seat-gray1 pt-8">
            <h2 className="mb-4 text-lg font-semibold">Additional Info</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-text/80">Terms & Conditions</h3>
                <p className="text-sm text-text/60">
                  By using SortMyScene, you agree to our terms of service. We are committed to providing a secure and reliable platform for event bookings. Please review our complete terms and conditions for more details on user responsibilities and platform policies.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-text/80">Privacy Policy</h3>
                <p className="text-sm text-text/60">
                  Your privacy is important to us. We collect and use your information only as necessary to provide our services. We do not share your personal data with third parties without your consent. Review our full privacy policy for comprehensive information on data handling.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-text/80">Refund Policy</h3>
                <p className="text-sm text-text/60">
                  Refunds are processed according to the event's specific refund policy. Most events allow cancellations up to 7 days before the event. Refund amounts may vary based on cancellation timing. Contact support for refund inquiries.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-text/80">Support</h3>
                <p className="text-sm text-text/60">
                  Need help? Our support team is available 24/7 to assist you. Whether you have questions about bookings, payments, or events, we're here to help. Reach out to us for any assistance you may need.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-seat-gray1 pt-8">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-300 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
              type="button"
            >
              <FaSignOutAlt />
              Log out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;