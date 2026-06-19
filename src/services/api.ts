/* eslint-disable @typescript-eslint/no-explicit-any */
import { get, post } from "./apiClient";

export const checkHome = () => {
  return get("/");
};

export const createUser = (data: any) => {
  return post("auth/signup", data);
};

export const loginUser = (data: any) => {
  return post("auth/login", data);
};

// export const updateUser = (id: string, data: any) => {
//   return put(`/users/${id}`, data);
// };

// export const deleteUser = (id: string) => {
//   return del(`/users/${id}`);
// };
