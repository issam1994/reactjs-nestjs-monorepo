import type { Role } from "./Role";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  mobileNumber: string;
  gender: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}
