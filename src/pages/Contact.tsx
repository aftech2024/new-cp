import { Mail, Phone, MapPin } from "lucide-react";
import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import ContactForm from "@/components/ContactForm";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { company, locations } from "@/data/company";

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact"
        description="Tell us what you are building. Our team will help identify the right technology, engineering or construction approach."
        path="/contact"
      />
      <PageHero
        eyebrow="Contact"
        title="Have a project in mind?"
        description="Tell us what you are building. Our team will help identify the right technology, engineering or construction approach."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Contact" }]}
      />
      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {locations.map((loc) => (
                <div key={loc.name} className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-aftech-teal shrink-0 mt-1" />
                  <div className="flex flex-col">
                    <span className="font-semibold">{loc.name}</span>
                    <span className="text-xs uppercase tracking-wide text-muted">{loc.tag}</span>
                    <span className="text-muted">{loc.address}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-aftech-teal shrink-0 mt-1" />
              <span>{company.email}</span>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-5 w-5 text-aftech-teal shrink-0 mt-1" />
              <span>{company.phone}</span>
            </div>
            <div className="flex items-start gap-4">
              <WhatsAppIcon className="h-5 w-5 text-aftech-teal shrink-0 mt-1" />
              <span>{company.whatsapp}</span>
            </div>
          </div>
          <ContactForm />
        </Container>
      </Section>
    </>
  );
}
