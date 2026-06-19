/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post, del } from "./apiClient";

export const checkHome = () => {
  return get("/");
};

// Auth
export const createUser = (data: any) => {
  return post("auth/signup", data);
};

export const loginUser = (data: any) => {
  return post("auth/login", data);
};

// Events
export const getAllEvents = () => {
  return get("/events");
};

export const getEventById = (id: string) => {
  return get(`/events/${id}`);
};

export const getEventSeatStatus = (id: string) => {
  return get(`/events/${id}/seats`);
};

// Reservations
export const createReservation = (data: any) => {
  return post("/reserve", data);
};

export const cancelReserveSeat = (id: string) => {
    return del(`/reserve/${id}`);
};

// Booking
export const bookReservedSeats = (data: any) => {
  return post("/bookings", data);
};

export const getBookings = () => {
  return get("/bookings");
};


// export const updateUser = (id: string, data: any) => {
//   return put(`/users/${id}`, data);
// };

// export const deleteUser = (id: string) => {
//   return del(`/users/${id}`);
// };
