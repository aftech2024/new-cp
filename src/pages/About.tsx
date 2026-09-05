import Seo from "@/components/Seo";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import ProjectGrid from "@/components/projects/ProjectGrid";
import CtaSection from "@/components/home/CtaSection";
import HaloraTeaser from "@/components/home/HaloraTeaser";
import { values } from "@/data/company";
import { projects } from "@/data/projects";
import aboutHero from "@/assets/images/datacenter/cabinet-fitout.jpg";

const valueStatements: Record<string, string> = {
  Innovation: "The right tool for the job — from proven systems to applied AI.",
  Integrity: "Transparent scope, honest reporting, no hidden costs.",
  Execution: "Surveyed, documented, and handed over — not just installed.",
  Reliability: "Systems designed to run, and monitored to stay running.",
  Collaboration: "One team across technology, engineering, and Halora.",
  "Continuous Improvement": "Every handover leaves documentation the next team can use.",
};

const engagementSteps = [
  {
    no: "01",
    title: "Tell us what you're building",
    desc: "A facility, a system, or an idea — our team helps define the right technology, engineering, or construction approach.",
  },
  {
    no: "02",
    title: "Survey & proposal",
    desc: "We assess the site or system, then propose a clear scope with transparent deliverables.",
  },
  {
    no: "03",
    title: "Delivery & handover",
    desc: "Coordinated execution across Aftech and Halora, documented and handed over ready to operate.",
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About"
        description="PT Aftech Daya Solusindo is a technology-first company also delivering mechanical & electrical capability, with civil and interior work delivered through our second company Halora."
        path="/about"
      />
      <PageHero
        eyebrow="About Aftech"
        title="We Create Your Idea Into Reality"
        description="We are a technology-first company that also delivers mechanical & electrical capability — built to help organizations operate across both the digital and physical world."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About" }]}
        backgroundImage={aboutHero}
      />

      <Section>
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <SectionHeading
            eyebrow="Company Overview"
            title="Who we are."
            description="PT Aftech Daya Solusindo delivers technology and engineering capability under one accountable team, positioning IT and digital solutions as our core. Civil construction and interior work are delivered through our second company, Halora."
          />
          <div className="flex flex-col gap-10">
            <div>
              <h3 className="font-display font-bold text-xl mb-2">Vision</h3>
              <p className="text-muted">
                To be a trusted technology and engineering partner that helps organizations build both their digital and
                physical infrastructure with confidence.
              </p>
            </div>
            <div>
              <h3 className="font-display font-bold text-xl mb-2">Mission</h3>
              <p className="text-muted">
                To deliver reliable, well-engineered technology and infrastructure solutions — from software and
                networks to building systems — with the same standard of accountability across every discipline.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading eyebrow="Values" title="What guides how we work." />
          </div>
          <ul className="flex flex-col">
            {values.map((value, i) => (
              <li key={value} className="flex items-baseline gap-5 border-t border-ink/10 py-5 last:border-b">
                <span className="shrink-0 font-mono text-xs text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{value}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {valueStatements[value] ?? ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Engagement"
              title="How we work with you."
              description="A simple path from first conversation to documented handover."
            />
            <LinkArrow to="/contact" className="mt-7">
              Start a conversation
            </LinkArrow>
          </div>
          <ol className="flex flex-col gap-px overflow-hidden rounded-pro border border-line bg-line">
            {engagementSteps.map((step) => (
              <li key={step.no} className="flex gap-5 bg-white p-6 md:p-7">
                <span className="font-display text-2xl font-semibold text-aftech">{step.no}</span>
                <div>
                  <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section tone="tint">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionHeading
              eyebrow="Proof of delivery"
              title="Work that speaks first."
              description="Real deployments from the field — documented scope, real locations."
            />
            <LinkArrow to="/projects">View all projects</LinkArrow>
          </div>
          <ProjectGrid
            projects={projects.filter(
              (p) => p.featured && !p.client?.includes("[") && !p.location?.includes("["),
            )}
          />
        </Container>
      </Section>

      <HaloraTeaser />
      <CtaSection />
    </>
  );
}
