// app/buyer/register/page.tsx
import { BuyerRegistrationForm } from "./form";

export default function BuyerRegistrationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-5">Buyer Registration</h1>
      <BuyerRegistrationForm />
    </div>
  );
}
