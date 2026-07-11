import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const BRAND = {
  name: process.env.MAIL_BRAND_NAME || "MarketPlace",
  logoUrl: process.env.LOGO,
  primaryColor: "#4F46E5", // indigo-600 — change to your brand color
  textColor: "#1F2937", // gray-800
  mutedColor: "#6B7280", // gray-500
  bgColor: "#F3F4F6", // gray-100
  cardColor: "#FFFFFF",
  borderColor: "#E5E7EB", // gray-200
  footerLinks: {
    site: process.env.CLIENT_URL || "https://yourapp.com",
    support: process.env.SUPPORT_EMAIL || "support@yourapp.com",
    unsubscribe: `${process.env.CLIENT_URL || "https://yourapp.com"}/unsubscribe`,
  },
  year: new Date().getFullYear(),
};

/**
 * Renders a call-to-action button (bulletproof, table-based, works in Outlook).
 * @param {{ text: string, url: string, color?: string }} opts
 */
export function emailButton({ text, url, color = BRAND.primaryColor }) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
    <tr>
      <td align="center" bgcolor="${color}" style="border-radius:6px;">
        <a href="${url}"
           target="_blank"
           style="display:inline-block; padding:12px 28px; font-family:Arial,Helvetica,sans-serif;
                  font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none;
                  border-radius:6px;">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Thin horizontal rule for separating sections inside the body. */
export function emailDivider() {
  return `<hr style="border:none; border-top:1px solid ${BRAND.borderColor}; margin:24px 0;" />`;
}

/**
 * Renders a simple key-value info row — handy for order summaries,
 * e.g. { "Order ID": "#ORD1234", "Amount": "₹2,499" }
 * @param {Record<string,string>} rows
 */
export function emailInfoTable(rows) {
  const rowsHtml = Object.entries(rows)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 0; font-size:14px; color:${BRAND.mutedColor}; font-family:Arial,Helvetica,sans-serif;">
          ${label}
        </td>
        <td align="right" style="padding:8px 0; font-size:14px; color:${BRAND.textColor}; font-weight:bold; font-family:Arial,Helvetica,sans-serif;">
          ${value}
        </td>
      </tr>`
    )
    .join("");

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="border-top:1px solid ${BRAND.borderColor}; border-bottom:1px solid ${BRAND.borderColor}; margin:16px 0;">
    ${rowsHtml}
  </table>`;
}

/**
 * The main layout. Wrap any email's unique content (bodyHtml) with this.
 *
 * @param {Object} opts
 * @param {string} opts.preheader - Hidden preview text shown in inbox list (50-100 chars ideal)
 * @param {string} opts.heading   - Main visible heading inside the card
 * @param {string} opts.bodyHtml  - Raw HTML for the email-specific content
 * @param {string} [opts.footerNote] - Optional extra line in the footer (e.g. "This link expires in 15 minutes")
 */
export function baseTemplate({
  preheader = "",
  heading = "",
  bodyHtml = "",
  footerNote = "",
}) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${heading}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Client resets — most email clients strip <style>, but Gmail/Apple Mail honor this */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
    body { margin:0; padding:0; width:100% !important; height:100% !important; }

    @media only screen and (max-width: 600px) {
      .email-container { width:100% !important; }
      .email-padding { padding-left:20px !important; padding-right:20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bgColor};">

  <!-- Preheader: hidden preview text in inbox, not visible in email body -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    ${preheader}
  </div>
  <!-- Whitespace hack to push out any trailing preview text from Gmail -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
    &#8203;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;&#8204;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.bgColor};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:100%;">

          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${BRAND.logoUrl}" alt="${BRAND.name}" width="140" style="display:block; height:auto;" />
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:${BRAND.cardColor}; border-radius:8px; border:1px solid ${BRAND.borderColor};">
                <tr>
                  <td class="email-padding" style="padding:36px 40px;">

                    ${
                      heading
                        ? `
                    <h1 style="margin:0 0 16px; font-family:Arial,Helvetica,sans-serif; font-size:22px; font-weight:bold; color:${BRAND.textColor};">
                      ${heading}
                    </h1>`
                        : ""
                    }

                    <div style="font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:1.6; color:${BRAND.textColor};">
                      ${bodyHtml}
                    </div>

                    ${
                      footerNote
                        ? `
                    <p style="margin:24px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; color:${BRAND.mutedColor};">
                      ${footerNote}
                    </p>`
                        : ""
                    }

                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 16px 0;">
              <p style="margin:0 0 8px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${BRAND.mutedColor};">
                Need help? <a href="mailto:${BRAND.footerLinks.support}" style="color:${BRAND.primaryColor}; text-decoration:none;">Contact support</a>
              </p>
              <p style="margin:0 0 8px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${BRAND.mutedColor};">
                <a href="${BRAND.footerLinks.site}" style="color:${BRAND.mutedColor}; text-decoration:underline;">Visit site</a>
                &nbsp;·&nbsp;
                <a href="${BRAND.footerLinks.unsubscribe}" style="color:${BRAND.mutedColor}; text-decoration:underline;">Unsubscribe</a>
              </p>
              <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:${BRAND.mutedColor};">
                &copy; ${BRAND.year} ${BRAND.name}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export default baseTemplate;
