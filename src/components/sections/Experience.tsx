import { ExperienceCircuit } from "./experience/ExperienceCircuit";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-16 py-20">
      <Container>
        <SectionHeading
          eyebrow="Where I've been"
          title="Experience"
          subtitle="Flip a switch to route the signal to a job — the circuit lights up the one you pick."
        />

        <ExperienceCircuit />
      </Container>
    </section>
  );
}
