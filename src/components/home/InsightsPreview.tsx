import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import LinkArrow from "@/components/ui/LinkArrow";
import InsightCard from "@/components/insights/InsightCard";
import { insights } from "@/data/insights";
import { staggerContainer, viewportOnce } from "@/lib/motion";

export default function InsightsPreview() {
  const latest = insights.slice(0, 3);

  return (
    <Section>
      <Container className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading eyebrow="Insights" title="Aftech Insights" />
          <LinkArrow to="/insights">All Insights</LinkArrow>
        </div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          {latest.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
