import {
  baseTemplate,
  emailButton,
  emailDivider,
} from "../layout/baseTemplate.js";

/**
 * @param {Object} opts
 * @param {string} opts.name          - User's display name
 * @param {string} [opts.verifyUrl]   - Email verification link (omit if already verified)
 * @param {string} [opts.exploreUrl]  - Link to homepage / product listing page
 */
export function welcomeEmail({
  name,
  verifyUrl,
  exploreUrl = process.env.CLIENT_URL || "https://yourapp.com",
}) {
  const bodyHtml = `
    <p style="margin:0 0 16px;">
      Hi ${name}, welcome aboard! 🎉
    </p>

    <p style="margin:0 0 16px;">
      Your account has been created successfully. You can now browse products
      from hundreds of sellers, track orders, and manage everything from your
      dashboard.
    </p>

    ${
      verifyUrl
        ? `
    <p style="margin:0 0 8px; font-weight:bold;">
      One last step — verify your email to unlock your account:
    </p>
    ${emailButton({ text: "Verify Email", url: verifyUrl })}
    `
        : `
    ${emailButton({ text: "Start Exploring", url: exploreUrl })}
    `
    }

    ${emailDivider()}

    <p style="margin:0; font-size:14px; color:#6B7280;">
      Here's what you can do next:
    </p>
    <ul style="margin:8px 0 0; padding-left:20px; font-size:14px; color:#374151; line-height:1.8;">
      <li>Browse products across multiple sellers</li>
      <li>Save items to your wishlist</li>
      <li>Track orders in real time from your dashboard</li>
    </ul>
  `;

  return baseTemplate({
    preheader: `Welcome to the family, ${name}! Let's get you started.`,
    heading: "Welcome to the Marketplace!",
    bodyHtml,
    footerNote: verifyUrl
      ? "This verification link expires in 24 hours."
      : "You're receiving this because you created a new account.",
  });
}

export default welcomeEmail;
