export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface SignupPayload {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
