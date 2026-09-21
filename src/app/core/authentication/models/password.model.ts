// Request/response shapes of the password endpoints in AuthController.

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// forgot-password, verify-otp and reset-password answer { success, message }.
export interface PasswordApiResponse {
  success?: boolean;
  message?: string;
}
