import baseTemplate from "../layout/baseTemplate.js";

/**
 * @param {Object} opts
 * @param {string} opts.name        - User's display name
 * @param {string} opts.otp         - 6-digit verification code, e.g. "482913"
 * @param {number} [opts.expiresInMinutes=15] - How long the code is valid for
 */
export function verifyEmailTemplate({ name, otp, expiresInMinutes = 15 }) {
  const digits = String(otp).split("");

  const digitBoxes = digits
    .map(
      (d) => `
      <td style="padding:0 4px;">
        <div style="width:40px; height:48px; background:#EEF2FF; border:1px solid #C7D2FE;
                    border-radius:8px; text-align:center; line-height:48px;
                    font-family:Arial,Helvetica,sans-serif; font-size:22px;
                    font-weight:bold; color:#4338CA;">
          ${d}
        </div>
      </td>`
    )
    .join("");

  const bodyHtml = `
    <p style="margin:0 0 16px;">
      Hi ${name},
    </p>

    <p style="margin:0 0 24px;">
      Thanks for signing up! Enter the code below in the app to confirm your
      email address and activate your account.
    </p>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
      <tr>${digitBoxes}</tr>
    </table>

    <p style="margin:0; font-size:14px; color:#6B7280; text-align:center;">
      This code expires in ${expiresInMinutes} minutes.
    </p>

    <p style="margin:24px 0 0; font-size:14px; color:#6B7280;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  `;

  return baseTemplate({
    preheader: `Your verification code is ${otp}`,
    heading: "Confirm Your Email",
    bodyHtml,
    footerNote: `This code expires in ${expiresInMinutes} minutes.`,
  });
}

export default verifyEmailTemplate;
