import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { profile } from "../../data/profile";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const infoCards = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
  ];

  function validate(values: FormState): Partial<FormState> {
    const next: Partial<FormState> = {};
    if (!values.name.trim()) next.name = "Name is required.";
    if (!values.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(values.email)) next.email = "Enter a valid email address.";
    if (!values.subject.trim()) next.subject = "Subject is required.";
    if (!values.message.trim()) next.message = "Message is required.";
    return next;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // TODO: replace this with a real API call (e.g. a Netlify Function) once
    // an email-sending service is wired up. For now this just simulates success.
    setSubmitted(true);
    setForm(EMPTY_FORM);
  }

  return (
    <section id="contact" className="scroll-mt-16 py-20">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact"
          subtitle="Have a project in mind or just want to say hello? I'd love to hear from you."
          align="center"
        />

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {infoCards.map(({ icon: Icon, label, value }) => (
            <Card key={label} className="text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="text-sm text-muted">{value}</p>
            </Card>
          ))}
        </div>

        <Card>
          {submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={40} className="mb-4 text-success" />
              <h3 className="text-lg font-semibold text-text">Message sent!</h3>
              <p className="mt-2 max-w-sm text-muted">
                Thanks for reaching out &mdash; I&apos;ll get back to you as soon as I can.
              </p>
              <Button variant="secondary" className="mt-6" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary"
                />
                {errors.name && <p className="mt-1 text-xs text-accent-2">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary"
                />
                {errors.email && <p className="mt-1 text-xs text-accent-2">{errors.email}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary"
                />
                {errors.subject && <p className="mt-1 text-xs text-accent-2">{errors.subject}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="w-full resize-none rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-primary"
                />
                {errors.message && <p className="mt-1 text-xs text-accent-2">{errors.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <Button type="submit">
                  <Send size={16} /> Send Message
                </Button>
              </div>
            </form>
          )}
        </Card>
      </Container>
    </section>
  );
}
