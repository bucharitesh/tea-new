import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Tailwind,
  Section,
  Img,
} from "@react-email/components";
import Footer from "./footer";

export default function EmailBody({
  email,
  marketing = false,
  children,
}: {
  email?: string;
  marketing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Bucharitesh.in</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans text-[#fb7185]">
          <Container className="relative mx-auto my-10 overflow-hidden bg-[#1c1917] max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5 z-20">
            {children}

            {email && (
              <Footer email={email} marketing={marketing} unsubscribe={false} />
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
