import toast from "react-hot-toast";
import { getBookings, getEventById } from "../services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaUserCircle } from "react-icons/fa";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";

type Booking = {
  _id: string;
  userId: string;
  eventId: string;
  seatNumbers: number[];
  bookedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

// booking API response type (not referenced directly here)

type Event = {
  _id: string;
  name: string;
  dateTime: string;
  venue: string;
  imageUrl: string;
};

const hasStoredToken = () => Boolean(localStorage.getItem("token")?.trim());

function MyBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventsMap, setEventsMap] = useState<Record<string, Event | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken);
  const [activeAuthModal, setActiveAuthModal] = useState<"login" | "signup" | null>(null);
  const getMyBooking = async () => {
    setIsLoading(true);
    try {
      const response = await getBookings();
      if (response?.success) {
        setBookings(response.bookings);

        // fetch event details in parallel
        const ids = Array.from(new Set(response.bookings.map((b: Booking) => b.eventId))) as string[];
        const promises = ids.map((id: string) => getEventById(id).catch(() => null));
        const results = (await Promise.all(promises)) as Array<{ success?: boolean; event?: Event } | null>;
        const map: Record<string, Event | null> = {};
        ids.forEach((id, idx) => {
          const res = results[idx];
          map[id] = res?.success ? (res.event as Event) : null;
        });
        setEventsMap(map);
      }
    } catch {
      toast.error("Unable to fetch bookings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void getMyBooking();
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasStoredToken());
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const formatEventDate = (dateTime?: string) => {
    if (!dateTime) return "Date coming soon";
    const date = new Date(dateTime);
    if (Number.isNaN(date.getTime())) return "Date coming soon";
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

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

          {isAuthenticated ? (
            <Link
              aria-label="Go to profile"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-seat-gray1 bg-white text-2xl text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white"
              to="/profile"
            >
              <FaUserCircle />
            </Link>
          ) : (
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
          )}
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-space-grotesk font-bold">My Bookings</h1>

        {isLoading ? (
          <div className="flex items-center justify-center rounded-2xl bg-white p-8 shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
            <div className="text-sm font-semibold text-text/60">Loading bookings...</div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
            <p className="mb-3 text-lg font-semibold">You have no bookings yet</p>
            <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white">
              Browse events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {bookings.map((b) => {
              const ev = eventsMap[b.eventId];
              return (
                <article key={b._id} className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
                  <div className="flex flex-col sm:flex-row">
                    <div className="h-44 w-full shrink-0 sm:h-auto sm:w-44 overflow-hidden bg-seat-gray1">
                      {ev?.imageUrl ? (
                        <img src={ev.imageUrl} alt={ev.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl text-text/40">
                          <FaTicketAlt />
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-6">
                      <h2 className="mb-1 text-lg font-semibold">{ev?.name ?? "Event"}</h2>
                      <div className="mb-3 flex flex-col gap-2 text-sm text-text/70 sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-primary" />
                          {formatEventDate(ev?.dateTime)}
                        </span>
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-primary" />
                          {ev?.venue ?? "Venue not available"}
                        </span>
                      </div>

                      <div className="mb-3 text-sm">
                        <div className="text-text/60">Seats</div>
                        <div className="font-semibold">{b.seatNumbers.join(", ")}</div>
                      </div>

                      <div className="mb-4 text-sm text-text/60">Booked on {new Date(b.bookedAt).toLocaleString()}</div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Link to={`/event/${b.eventId}`} className="rounded-xl border border-seat-gray1 px-3 py-2 text-sm font-semibold transition hover:border-primary">
                          View event
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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

export default MyBooking;
