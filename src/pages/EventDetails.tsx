import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import SeatGrid from "../components/SeatGrid";
import BookingModal from "../components/BookingModal";
import {
  bookReservedSeats,
  cancelReserveSeat,
  getEventById,
} from "../services/api";

type Event = {
  _id: string;
  name: string;
  dateTime: string;
  venue: string;
  totalSeats: number;
  imageUrl: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
};

const formatEventDate = (dateTime: string) => {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return "Date coming soon";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const hasStoredToken = () => Boolean(localStorage.getItem("token")?.trim());

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(hasStoredToken);
  const [activeAuthModal, setActiveAuthModal] = useState<
    "login" | "signup" | null
  >(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [reservationInfo, setReservationInfo] = useState<null | any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchEventDetails = async (eventId: string) => {
    setIsLoading(true);
    try {
      const response = await getEventById(eventId);
      if (response?.success) {
        setEvent(response.event as Event);
      }
    } catch (err) {
      toast.error("Unable to fetch event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEventDetails(id);
  }, [id]);

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasStoredToken());
    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const handleBuy = () => {
    if (!hasStoredToken()) {
      setActiveAuthModal("login");
      return;
    }

    if (event?._id) {
      setShowSeatModal(true);
    }
  };

  const handleReservation = (res: any) => {
    setReservationInfo(res);
    setShowSeatModal(false);
    setShowBookingModal(true);
  };

  const cancelReservation = async (revId: string) => {
    try {
      const response = await cancelReserveSeat(revId);
      if (response?.success) {
        toast.success("Reservation cancelled");
        setReservationInfo(null);
        setShowBookingModal(false);
      }
    } catch {
      toast.error("Unable to cancel reservation. Please try again.");
    } finally {
      // will decide later
    }
  };

  const bookSeats = async (revId: string) => {
    try {
      const payload = {
        reservationId: revId,
      };
      const response = await bookReservedSeats(payload);
      if (response?.success) {
        toast.success("Payment successful. Booking confirmed.");
        setShowBookingModal(false);
        setReservationInfo(null);
        navigate("/my-bookings");
      }
      return true;
    } catch {
      toast.error("Payment failed. Please try again.");
      return false;
    }
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
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_18px_45px_rgba(26,27,35,0.06)]">
          {isLoading ? (
            <div className="flex min-h-[360px] items-center justify-center bg-seat-gray1/40 text-sm font-bold text-text/60">
              Loading event...
            </div>
          ) : event ? (
            <div>
              <div className="relative h-[420px] sm:h-[520px]">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute left-6 bottom-6 z-10 max-w-3xl text-white">
                  <p className="mb-3 w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]">
                    Event
                  </p>
                  <h1 className="font-space-grotesk text-4xl font-bold sm:text-5xl">
                    {event.name}
                  </h1>
                  <div className="mt-4 flex flex-col gap-3 text-sm font-semibold sm:flex-row sm:items-center">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      {formatEventDate(event.dateTime)}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-primary" />
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-space-grotesk text-2xl font-bold">
                      About the event
                    </h2>
                    <p className="mt-1 text-sm text-text/60">
                      {event.totalSeats} seats available
                    </p>
                  </div>
                </div>

                <div className="prose max-w-none text-text/90">
                  {event.description ? (
                    <p>{event.description}</p>
                  ) : (
                    <p className="text-sm text-text/60">
                      No description provided for this event.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-sm font-bold text-text/60">
              Event not found
            </div>
          )}
        </div>
      </section>

      {/* Fixed buy bar */}
      <div className="fixed bottom-4 left-0 right-0 z-40 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between">
          <div className="mb-3 flex items-center gap-4 sm:mb-0">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-seat-gray1">
              <img
                src={event?.imageUrl}
                alt={event?.name ?? "event"}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-semibold">{event?.name}</div>
              <div className="text-xs text-text/60">
                {event ? formatEventDate(event.dateTime) : ""}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="text-left">
              <div className="text-sm font-semibold text-primary">
                From ₹499
              </div>
              <div className="text-xs text-text/60">Booking fees may apply</div>
            </div>
            <button
              onClick={handleBuy}
              type="button"
              className="inline-flex items-center gap-3 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(124,58,237,0.28)] transition hover:bg-primary-hover"
            >
              Buy ticket
              <FaArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
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

        {showSeatModal && event?._id && (
          <SeatGrid
            eventId={event._id}
            onClose={() => setShowSeatModal(false)}
            onReserved={handleReservation}
          />
        )}

        {showBookingModal && reservationInfo && (
          <BookingModal
            reservation={reservationInfo}
            onCancel={() => cancelReservation(reservationInfo?.reservationId)}
            onPay={() => bookSeats(reservationInfo?.reservationId)}
            onClose={() => {
              setShowBookingModal(false);
              setReservationInfo(null);
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default EventDetails;
