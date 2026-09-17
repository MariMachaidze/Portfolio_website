import * as OTPAuth from "otpauth";

// Single source of truth for TOTP parameters. If these ever change, the
// one-time enrollment script (scripts/generate-admin-secrets.mjs) must be
// updated to match, or previously-generated secrets stop validating.
export const TOTP_ALGORITHM = "SHA1";
export const TOTP_DIGITS = 6;
export const TOTP_PERIOD = 30;

export function createTotp(base32Secret: string) {
  return new OTPAuth.TOTP({
    algorithm: TOTP_ALGORITHM,
    digits: TOTP_DIGITS,
    period: TOTP_PERIOD,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });
}
