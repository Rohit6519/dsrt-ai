import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.FROM_EMAIL || "onboarding@resend.dev";

if (!apiKey) {
  throw new Error("RESEND_API_KEY is missing from .env");
}

const resend = new Resend(apiKey);

export async function sendPreRegistrationEmail(name: string, email: string) {
  const { data, error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Thank You for Pre-Registering with DSRT AI!",
    html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; color: #222;">
            <h2>Thank You, ${escapeHtml(name)}!</h2>
            <p>Thank you for pre-registering with DSRT AI.</p>
            <p>Your pre-registration has been successfully received.</p>
            <p>We'll keep you updated about our launch and early access.</p>
            <br/>
            <p>Best Regards,<br/><strong>Team DSRT AI</strong></p>
          </div>
        `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  return data;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] || char,
  );
}
