import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaSearch,
  FaTicketAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { getAllEvents } from "../services/api";

type Event = {
  _id: string;
  name: string;
  dateTime: string;
  venue: string;
  totalSeats: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

const formatEventDate = (dateTime: string) => {
  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return "Date coming soon";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const hasStoredToken = () => Boolean(localStorage.getItem("token")?.trim());

function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken);
  const [activeAuthModal, setActiveAuthModal] = useState<"login" | "signup" | null>(
    null,
  );

  const featuredEvents = useMemo(() => events.slice(0, 5), [events]);
  const activeEvent = featuredEvents[activeIndex] ?? featuredEvents[0];

  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      const response = await getAllEvents();
      if (response?.success) {
        setEvents((response.events as Event[]) ?? []);
      }
    } catch {
      toast.error("Unable to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasStoredToken());

    window.addEventListener("storage", syncAuthState);

    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  useEffect(() => {
    if (featuredEvents.length <= 1) {
      return;
    }

    const carouselTimer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % featuredEvents.length);
    }, 4500);

    return () => window.clearInterval(carouselTimer);
  }, [featuredEvents.length]);

  const goToSlide = (direction: "previous" | "next") => {
    if (!featuredEvents.length) {
      return;
    }

    setActiveIndex((currentIndex) => {
      if (direction === "previous") {
        return currentIndex === 0 ? featuredEvents.length - 1 : currentIndex - 1;
      }

      return (currentIndex + 1) % featuredEvents.length;
    });
  };

  const openFeaturedEvent = () => {
    if (activeEvent?._id) {
      navigate(`/event/${activeEvent._id}`);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setActiveAuthModal(null);
  };

  return (
    <main className="min-h-screen bg-background font-inter text-text">
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

          <div className="hidden flex-1 items-center rounded-xl border border-seat-gray1 bg-white px-4 py-3 shadow-sm transition focus-within:border-primary md:flex md:max-w-md lg:max-w-xl">
            <FaSearch className="mr-3 shrink-0 text-primary" />
            <input
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-text/40"
              placeholder="Search for events, artists, venues"
              type="search"
            />
          </div>

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
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-bold text-text transition hover:text-primary md:hidden"
              >
                Log in
              </Link>
              <button
                className="hidden cursor-pointer rounded-xl px-4 py-2 text-sm font-bold text-text transition hover:text-primary md:block"
                onClick={() => setActiveAuthModal("login")}
                type="button"
              >
                Log in
              </button>
              <Link
                to="/signup"
                className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(124,58,237,0.26)] transition hover:bg-primary-hover md:hidden"
              >
                Sign up
              </Link>
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

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-center rounded-xl border border-seat-gray1 bg-white px-4 py-3 shadow-sm md:hidden">
          <FaSearch className="mr-3 shrink-0 text-primary" />
          <input
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-text/40"
            placeholder="Search events"
            type="search"
          />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-text shadow-[0_24px_60px_rgba(26,27,35,0.16)]">
          {isLoading ? (
            <div className="flex min-h-[320px] items-center justify-center bg-seat-gray1/40 text-sm font-bold text-text/60 sm:min-h-[420px]">
              Loading featured events...
            </div>
          ) : activeEvent ? (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEvent._id}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative min-h-[360px] cursor-pointer sm:min-h-[440px] lg:min-h-[500px]"
                  exit={{ opacity: 0, scale: 1.02 }}
                  initial={{ opacity: 0, scale: 1.02 }}
                  onClick={openFeaturedEvent}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      openFeaturedEvent();
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                >
                  <img
                    alt={activeEvent.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={activeEvent.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent pb-10 pt-28" />

                  <div className="relative z-10 flex min-h-[360px] max-w-3xl flex-col justify-end px-5 py-8 text-white sm:min-h-[440px] sm:px-8 lg:min-h-[500px] lg:px-10">
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur-md"
                      initial={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.1 }}
                    >
                      Featured event
                    </motion.p>
                    <motion.h1
                      animate={{ opacity: 1, y: 0 }}
                      className="font-space-grotesk text-4xl font-bold tracking-normal sm:text-5xl lg:text-6xl"
                      initial={{ opacity: 0, y: 16 }}
                      transition={{ delay: 0.16 }}
                    >
                      {activeEvent.name}
                    </motion.h1>
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 flex flex-col gap-3 text-sm font-semibold text-white/86 sm:flex-row sm:flex-wrap sm:items-center"
                      initial={{ opacity: 0, y: 18 }}
                      transition={{ delay: 0.22 }}
                    >
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {formatEventDate(activeEvent.dateTime)}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        {activeEvent.venue}
                      </span>
                    </motion.div>
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-7"
                      initial={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.28 }}
                    >
                      <Link
                        to={`/event/${activeEvent._id}`}
                        className="inline-flex items-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_16px_36px_rgba(124,58,237,0.34)] transition hover:bg-primary-hover"
                      >
                        View details
                        <FaArrowRight className="text-xs" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {featuredEvents.length > 1 ? (
                <>
                  <button
                    aria-label="Previous featured event"
                    className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-text shadow-lg transition hover:bg-white hover:text-primary sm:flex"
                    onClick={() => goToSlide("previous")}
                    type="button"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    aria-label="Next featured event"
                    className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-text shadow-lg transition hover:bg-white hover:text-primary sm:flex"
                    onClick={() => goToSlide("next")}
                    type="button"
                  >
                    <FaChevronRight />
                  </button>
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {featuredEvents.map((event, index) => (
                      <button
                        aria-label={`Show ${event.name}`}
                        className={`h-2.5 rounded-full transition ${
                          index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-white/70"
                        }`}
                        key={event._id}
                        onClick={() => setActiveIndex(index)}
                        type="button"
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center bg-seat-gray1/40 px-6 text-center text-sm font-bold text-text/60 sm:min-h-[420px]">
              No featured events are available right now.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 lg:px-8 lg:pb-16">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold text-primary">Book your next scene</p>
            <h2 className="font-space-grotesk text-3xl font-bold tracking-normal text-text sm:text-4xl">
              Events near you
            </h2>
          </div>
          <p className="text-sm font-semibold text-text/55">
            {events.length ? `${events.length} events available` : "Fresh events will appear here"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className="h-[360px] animate-pulse rounded-2xl border border-seat-gray1 bg-seat-gray1/40"
                key={index}
              />
            ))}
          </div>
        ) : events.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {events.map((event, index) => (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="group overflow-hidden rounded-2xl border border-seat-gray1 bg-white shadow-[0_18px_45px_rgba(26,27,35,0.08)] transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_55px_rgba(124,58,237,0.16)]"
                initial={{ opacity: 0, y: 22 }}
                key={event._id}
                transition={{ delay: Math.min(index * 0.04, 0.28), duration: 0.35 }}
              >
                <Link to={`/event/${event._id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-seat-gray1">
                    <img
                      alt={event.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={event.imageUrl}
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
                      {event.totalSeats} seats
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="line-clamp-2 font-space-grotesk text-2xl font-bold tracking-normal text-text">
                      {event.name}
                    </h3>
                    <div className="mt-4 grid gap-3 text-sm font-semibold text-text/62">
                      <span className="flex items-center gap-2">
                        <FaCalendarAlt className="shrink-0 text-primary" />
                        {formatEventDate(event.dateTime)}
                      </span>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="shrink-0 text-primary" />
                        {event.venue}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-seat-gray1 pt-4">
                      <span className="text-sm font-bold text-primary">Explore event</span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                        <FaArrowRight className="text-sm" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-seat-gray2 bg-white px-6 py-14 text-center">
            <h3 className="font-space-grotesk text-2xl font-bold tracking-normal">
              No events found
            </h3>
            <p className="mt-2 text-sm font-semibold text-text/55">
              Check back soon for new shows, workshops, and live experiences.
            </p>
          </div>
        )}
      </section>

      {activeAuthModal === "login" && (
        <LoginModal
          onClose={() => setActiveAuthModal(null)}
          onSuccess={handleAuthSuccess}
          onSwitchToSignup={() => setActiveAuthModal("signup")}
        />
      )}
      {activeAuthModal === "signup" && (
        <SignupModal
          onClose={() => setActiveAuthModal(null)}
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setActiveAuthModal("login")}
        />
      )}
    </main>
  );
}

export default Home;
