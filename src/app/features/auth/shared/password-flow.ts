import { HttpErrorResponse } from '@angular/common/http';

// Carries the email (and "OTP verified") across the three public screens:
// Forgot Password -> Verify OTP -> Reset Password. The API identifies the
// user by email on every step, so the email has to survive the navigation.
// sessionStorage keeps it across a page refresh but not across tabs.

const EMAIL_KEY = 'passwordReset.email';
const VERIFIED_KEY = 'passwordReset.otpVerified';

function store(): Storage | null {

  try {
    return typeof sessionStorage !== 'undefined' ? sessionStorage : null;
  } catch {
    return null;
  }

}

export const passwordFlow = {

  getEmail(): string {
    return store()?.getItem(EMAIL_KEY) ?? '';
  },

  setEmail(email: string): void {
    store()?.setItem(EMAIL_KEY, email);
    store()?.removeItem(VERIFIED_KEY);
  },

  isOtpVerified(): boolean {
    return store()?.getItem(VERIFIED_KEY) === 'true';
  },

  setOtpVerified(): void {
    store()?.setItem(VERIFIED_KEY, 'true');
  },

  clear(): void {
    store()?.removeItem(EMAIL_KEY);
    store()?.removeItem(VERIFIED_KEY);
  }

};


export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;


// The message to show for a failed call.
//
// The API's own message is used whenever the response carries one (a JSON
// { message } or ASP.NET validation errors). Business errors such as a wrong
// OTP currently come back as a bare HTTP 500 without a message, so the
// caller's step-specific fallback is used for those.
export function apiErrorMessage(err: unknown, fallback: string): string {

  const e = err as HttpErrorResponse;

  if (e?.status === 0) {
    return 'Unable to reach the server. Please check your connection and try again.';
  }

  const body: any = e?.error;

  if (body && typeof body === 'object') {

    const message = body.message ?? body.Message;

    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    // Model validation from [ApiController]: { errors: { Field: [msg] } }
    if (body.errors && typeof body.errors === 'object') {

      const first = (Object.values(body.errors) as unknown[])
        .flat()
        .find(x => typeof x === 'string') as string | undefined;

      if (first) {
        return first;
      }

    }

  }

  return fallback;

}


// change-password returns a bare string; depending on content negotiation it
// arrives either as plain text or as a JSON string (with quotes).
export function plainText(text: string | null | undefined): string {

  const value = (text ?? '').trim();

  try {
    const parsed = JSON.parse(value);
    return typeof parsed === 'string' ? parsed : value;
  } catch {
    return value;
  }

}
