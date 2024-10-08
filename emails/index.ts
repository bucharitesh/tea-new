import { CreateEmailOptions, Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  email,
  subject,
  from,
  bcc,
  text,
  react,
  scheduledAt,
}: Omit<CreateEmailOptions, "to" | "from"> & {
  email: string;
  from?: string;
  replyToFromEmail?: boolean;
  marketing?: boolean;
}) => {
  if (process.env.NODE_ENV === "development" && !resend) {
    // Set up a fake email client for development
    console.info(
      `Email to ${email} with subject ${subject} sent from ${
        from || process.env.NEXT_PUBLIC_APP_NAME
      }`
    );
    return Promise.resolve();
  } else if (!resend) {
    console.error(
      "Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work."
    );
    return Promise.resolve();
  }

  return resend.emails.send({
    to: email,
    from: from || "Pranav Yellayi <onboarding@resend.dev>",
    bcc: bcc,
    subject: subject,
    text: text,
    react: react,
    scheduledAt,
  });
};
