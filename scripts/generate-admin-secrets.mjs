// One-time local setup script for the admin panel's password + TOTP secrets.
//
// Run it with: node scripts/generate-admin-secrets.mjs
//
// It prints three values you paste into Netlify's dashboard
// (Site settings > Environment variables) — never into any file in this repo:
//   ADMIN_PASSWORD_HASH, TOTP_SECRET, SESSION_JWT_SECRET
//
// Nothing here is written to disk. Close your terminal (or clear scrollback)
// once you've copied the values into Netlify.

import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import readline from "node:readline";
import * as OTPAuth from "otpauth";
import qrcodeTerminal from "qrcode-terminal";

function promptHiddenPassword(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    // Mute echoed output so the password isn't visible on screen while typing.
    rl._writeToOutput = (chunk) => {
      if (chunk.includes("\n") || chunk.includes("\r")) rl.output.write(chunk);
    };
    rl.question(question, (answer) => {
      rl.output.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const siteName = process.argv[2] || "Portfolio Admin";

  const password = await promptHiddenPassword("Choose your admin password (input hidden): ");
  if (password.length < 12) {
    console.error("\nPlease choose a password of at least 12 characters. Nothing was generated.");
    process.exit(1);
  }

  const passwordHash = bcrypt.hashSync(password, 12);

  const totpSecret = new OTPAuth.Secret({ size: 20 }); // 160-bit, standard TOTP strength
  const totp = new OTPAuth.TOTP({
    issuer: siteName,
    label: "admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: totpSecret,
  });

  const sessionSecret = randomBytes(32).toString("hex");

  console.log("\nScan this QR code into Google Authenticator (or Authy/1Password TOTP):\n");
  qrcodeTerminal.generate(totp.toString(), { small: true });

  console.log("\nIf you can't scan it, enter this key manually in your authenticator app:");
  console.log("  " + totpSecret.base32);

  console.log("\nOnce scanned, paste these three values into Netlify's dashboard");
  console.log("(Site settings > Environment variables) — do not save them anywhere else:\n");
  console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
  console.log(`TOTP_SECRET=${totpSecret.base32}`);
  console.log(`SESSION_JWT_SECRET=${sessionSecret}`);
  console.log("\nDone. Clear your terminal scrollback once you've copied these.");
}

main();
