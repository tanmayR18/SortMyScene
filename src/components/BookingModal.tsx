import { useEffect, useState } from "react";

type ReservationResponse = {
  success: boolean;
  message: string;
  reservationId: string;
  expiresAt: string;
  seatNumbers: number[];
};

function formatTimeLeft(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function BookingModal({
  reservation,
  onCancel,
  onPay,
  onClose,
}: {
  reservation: ReservationResponse;
  onCancel: () => Promise<void> | void;
  onPay: () => Promise<boolean> | boolean;
  onClose: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (reservation?.expiresAt) {
      const diff = Math.max(0, Math.floor((new Date(reservation.expiresAt).getTime() - Date.now()) / 1000));
      return diff || 10 * 60;
    }
    return 10 * 60;
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      // auto cancel when expired
      (async () => {
        await onCancel();
        onClose();
      })();
    }
  }, [secondsLeft, onCancel, onClose]);

  const handlePay = async () => {
    if (secondsLeft <= 0) return;
    setIsProcessing(true);
    try {
      const ok = await onPay();
      if (ok) {
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    await onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Complete payment</h3>
          <button onClick={onClose} type="button" className="text-sm text-text/60">
            Close
          </button>
        </div>

        <div className="mb-4 text-sm text-text/80">
          Reservation: <span className="font-medium">{reservation?.reservationId}</span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm">Time left</div>
          <div className="text-sm font-mono font-bold">{formatTimeLeft(secondsLeft)}</div>
        </div>

        <div className="mb-6 rounded-md border border-seat-gray2 p-4">
          <div className="mb-2 text-sm font-semibold">Dummy payment gateway</div>
          <div className="flex gap-3">
            <button
              onClick={handlePay}
              disabled={isProcessing || secondsLeft <= 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Pay"}
            </button>
            <button onClick={handleCancel} type="button" className="rounded-xl px-4 py-2 text-sm font-semibold border border-seat-gray2">
              Cancel
            </button>
          </div>
        </div>

        <div className="text-xs text-text/60">Seats: {reservation?.seatNumbers?.join(", ")}</div>
      </div>
    </div>
  );
}
