import { Heading } from "@react-email/components";
import EmailBody from "./components/email-body";

export default function WelcomeEmail({
  email = "contact@bucharitesh.in",
}: {
  email: string;
}) {
  return (
    <EmailBody email={email}>
      <Heading className="mx-0 my-7 p-0 text-center text-[#f43f5e] text-xl font-semibold">
        Welcome {email}
      </Heading>
    </EmailBody>
  );
}
