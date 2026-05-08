import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Custom Orders",
  description:
    "Send Donna a message about a custom order, sizing question, or anything else. She replies to every email herself, usually within a day or two.",
  openGraph: {
    title: "Contact & Custom Orders — Donna Upcycles It",
    description:
      "Commission a one-of-one piece or ask Donna a question. Custom orders open year-round.",
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
