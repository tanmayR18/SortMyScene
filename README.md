# SortMyScene — Event Ticket Booking Assignment

A simplified event ticket booking flow built with the MERN stack, focused on seat reservation and booking confirmation.

**Live demo:** https://sort-my-scene-a4w6.vercel.app/

---

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Frontend:** React.js, Tailwind CSS, React Router
- **Auth:** JWT

---

## How to Run

### Backend

1. Clone the backend repo.
2. Create a `.env` file in the root with the following:

```
DATABASE_URL = your MongoDB connection string, e.g. mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/sortmyscene
PORT = 4000
JWT_SECRET = any secret string of your choice, e.g. Tatakae
```

> Note: the `/sortmyscene` at the end of `DATABASE_URL` is the database name — make sure it's included.

3. Install dependencies and start the server:

```
npm install
npm run start
```

The server will start on the port specified in `.env` (e.g. `http://localhost:4000`).

### Frontend

1. Clone the frontend repo.
2. Create a `.env` file in the root with the following:

```
VITE_BASE_URL = http://localhost:4000/api/v1
```

> The port here must match the `PORT` you set in the backend `.env`.

3. Install dependencies and start the dev server:

```
npm install
npm run dev
```

The app will start on `http://localhost:5173` (or `5174` if 5173 is taken — check your terminal output for the exact URL).

---

## Assumptions

Since a few areas of the brief were left open to interpretation, here's what I assumed and why:

- **Authentication:** The brief asked for "basic user authentication" without specifying signup/login flows in detail. I implemented email + password signup/login with JWT, since that's the minimum needed to actually identify *who* is reserving/booking a seat — without it, there's no way to attach a reservation to a real user.
- **Password security:** Passwords are hashed using bcrypt before being stored in MongoDB. There's no additional encryption/decryption of data between frontend and backend beyond what HTTPS provides in transit — the brief specified "basic" authentication, so I didn't implement anything beyond hashing at rest and relying on HTTPS for transit security.
- **Models beyond the brief:** In addition to `Event`, `Seat`, and `Reservation` (explicitly listed in the brief), I added two more models for correctness and simplicity:
  - **`User`** — required to support authentication.
  - **`Booking`** — a permanent record created when a reservation is confirmed. The brief says booking "marks the seats as booked and removes the reservation" — but if the `Reservation` document is deleted and there's no separate permanent record, there's no way to know *who* booked a seat after the fact, or to show a user their booking history. `Booking` solves this: `Reservation` is a temporary hold, `Booking` is the permanent receipt.
- **Seat creation:** Seats aren't created lazily on first reservation attempt — they're bulk-created upfront when an `Event` is created (based on its `totalSeats` field). This is necessary for the atomic seat-locking approach described below to work, since it relies on the seat document already existing.
- **Event creation:** There's no UI for creating events — `POST /api/v1/events` is meant to be hit directly via Postman/API client, since the brief only specifies a frontend for the booking flow, not event management.
- **Seat grid layout:** Seats are rendered in a grid of 10 rows x 12-15 columns for visual purposes — the brief doesn't specify an exact layout, only that seats need a status-based color coding.

---

## Design Decisions

### How I avoid double booking

The core risk is two users trying to reserve the same seat at (or near) the same moment. I handle this with two layers:

1. **Atomic seat claiming with `findOneAndUpdate`.** Instead of separately checking a seat's status and then updating it (which leaves a gap where another request could slip in between the check and the write), I do both in a single atomic database operation:

```js
const seat = await Seat.findOneAndUpdate(
  { eventId, seatNumber, status: "available" },
  { status: "reserved" },
  { new: true, session }
);
```

If two requests hit this for the same seat at virtually the same time, MongoDB serializes the two operations internally. Whichever request reaches MongoDB first successfully claims the seat (the condition `status: "available"` matches, so the update applies). The second request's condition no longer matches — the seat's status has already changed — so `findOneAndUpdate` returns `null`, and that request is rejected with a clear error instead of silently overwriting the first user's reservation.

2. **MongoDB transactions for multi-seat reservations.** Since a user can select multiple seats in one go, each seat is claimed in a loop inside a single transaction. If any one seat in the selection fails (already taken), the entire transaction is aborted — every seat claimed earlier in that same loop is rolled back to `available`. This gives an all-or-nothing outcome: either every requested seat is reserved, or none are, so a user never ends up holding a partial, confusing selection.

### How reservation expiry is handled

A reservation holds seats for 10 minutes. Two mechanisms work together to enforce this:

- A background interval (running every 30 seconds) scans for reservations past their `expiresAt`, releases their seats back to `available`, and deletes the stale reservation document. This handles the case where a user simply abandons the flow without confirming or cancelling.
- The booking confirmation endpoint independently re-checks `expiresAt` against the current time before confirming, rather than trusting that the reservation document's mere existence means it's still valid. This closes the small timing gap between when a reservation actually expires and when the background interval next runs.

### Why a separate `Booking` model

`Seat.status` only needs to answer "can this seat be reserved right now" — it's a live state flag, not a history log. `Booking` is the permanent record of who booked what and when, queryable independently of whatever happens to the temporary `Reservation` document. This also makes a "my bookings" history feature straightforward to add later.

---

## Difficulties Faced

The most challenging part of this assignment, on both the frontend and backend, was the seat reservation and booking flow — specifically getting the concurrency handling right (atomic updates, transactions, and making sure expired reservations were cleaned up correctly without leaving seats stuck in a "reserved" state with no reservation document left to release them).

---

## What I'd Add With More Time

A few ideas I considered but didn't implement, either due to time constraints or because they weren't part of the original brief:

- **Trending events** — surfacing events based on how many seats have been booked.
- **Upcoming events** — a flag on the `Event` model for events that have been announced but don't have tickets on sale yet, to support an "Upcoming" section distinct from events currently bookable.
- **Search functionality** — letting users search/filter events by name, venue, or date.

These would let the home page support All / Trending / Upcoming sections, but I kept scope tight to the brief given the assignment timeline.
