import toast from "react-hot-toast";
import { createReservation, getEventSeatStatus } from "../services/api";
import { useEffect, useState } from "react";

type ReservationResponse = {
  success: boolean;
  message: string;
  reservationId: string;
  expiresAt: string;
  seatNumbers: number[];
};

type Seat = {
  _id: string;
  eventId: string;
  seatNumber: number;
  status: "available" | "reserved" | "booked";
  createdAt: string;
  updatedAt: string;
};

type SeatStatusResponse = {
  success: boolean;
  seats: Seat[];
};

function SeatGrid({
  eventId,
  onClose,
  onReserved,
}: {
  eventId: string;
  onClose: () => void;
  onReserved: (res: ReservationResponse) => void;
}) {
  const [seatNumbers, setSeatNumbers] = useState<number[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const response = await getEventSeatStatus(eventId);
        if (response?.success) {
          setSeats(response.seats ?? []);
        }
      } catch (err) {
        toast.error("Unable to load seats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [eventId]);

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "available") return;
    setSeatNumbers((prev) => {
      if (prev.includes(seat.seatNumber)) {
        return prev.filter((s) => s !== seat.seatNumber);
      }
      return [...prev, seat.seatNumber];
    });
  };

  const reserveSeats = async () => {
    if (!seatNumbers.length) {
      toast.error("Please select at least one seat.");
      return;
    }
    try {
      const payload = {
        eventId,
        seatNumbers,
      };
      const response = await createReservation(payload);
      if (response?.success) {
        toast.success("Seats reserved successfully.");
      // forward reservation details to parent to open booking/payment modal
      onReserved(response as ReservationResponse);
    } else {
      toast.error(response?.message ?? "Unable to reserve seats.");
    }
    } catch (err) {
    toast.error("Unable to reserve seats. Please try again.");
    }
  };

  // Arrange into 5 rows
  const rows = 5;
  const cols = Math.max(1, Math.ceil(seats.length / rows));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Select seats</h3>
          <button
            onClick={onClose}
            type="button"
            className="text-sm text-text/60"
          >
            Close
          </button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            Loading seats...
          </div>
        ) : (
          <div>
            <div
              className="max-w-[320px] mx-auto overflow-y-auto"
              style={{ height: 250 }}
            >
                <div className="text-center  text-lg mb-4 p-2 bg-seat-gray1 rounded-xl">
                    Stage
                </div>
              <div className="grid gap-2 grid-cols-5 justify-center mt-10">
                {seats.map((seat) => {
                  const isSelected = seatNumbers.includes(seat.seatNumber);
                  const base =
                    "flex items-center justify-center h-12 w-12 rounded-md font-semibold text-sm";
                  let cls = "";
                  if (seat.status === "booked" || seat.status === "reserved")
                    cls = "bg-seat-gray1 cursor-not-allowed";
                  else if (isSelected) cls = "bg-seat-green text-white";
                  else cls = "bg-white border border-seat-gray2 cursor-pointer";

                  return (
                    <button
                      key={seat._id}
                      type="button"
                      onClick={() => toggleSeat(seat)}
                      className={`${base} ${cls}`}
                    >
                      {seat.seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-3 flex items-center justify-start gap-6 mt-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded-sm bg-seat-gray1" />
                <span className="text-sm">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded-sm bg-white border border-seat-gray2" />
                <span className="text-sm">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-4 w-4 rounded-sm bg-seat-green" />
                <span className="text-sm">Selected</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-text/60">
                Selected: {seatNumbers.length}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  className="rounded-xl px-4 py-2 text-sm font-semibold border border-seat-gray2"
                >
                  Cancel
                </button>
                <button
                  onClick={reserveSeats}
                  type="button"
                  className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white"
                >
                  Book
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatGrid;
