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

function encodeFormData(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
}

export function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Cards with no value (e.g. the phone, left blank in the admin panel) are hidden.
  const infoCards = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
  ].filter((card) => card.value.trim());

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // A filled-in honeypot field means a bot submitted the form — pretend
    // success without actually sending anything.
    const botField = new FormData(event.currentTarget).get("bot-field");
    if (botField) {
      setSubmitted(true);
      setForm(EMPTY_FORM);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData({ "form-name": "contact", ...form }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      setSubmitError(`Something went wrong sending that — please email me directly at ${profile.email} instead.`);
    } finally {
      setSubmitting(false);
    }
  }

  // theme-light-blue (index.css) re-points the theme tokens to the Projects
  // section's light blue, while everything below stays on the shared token
  // classes. Fields sit in a slightly darker blue well with a muted/60 outline
  // (3:1 against the card) and turn ink on focus.
  return (
    <section id="contact" className="theme-light-blue scroll-mt-16 bg-bg py-20">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Get in touch"
          title="Contact"
          subtitle="Have a project in mind or just want to say hello? I'd love to hear from you."
          align="center"
        />

        <div className={`mb-10 grid gap-4 ${infoCards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
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
              <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" className="hidden" />
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-lg border border-muted/60 bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-text"
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
                  className="w-full rounded-lg border border-muted/60 bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-text"
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
                  className="w-full rounded-lg border border-muted/60 bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-text"
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
                  className="w-full resize-none rounded-lg border border-muted/60 bg-bg px-3.5 py-2.5 text-sm text-text outline-none transition-colors duration-200 focus:border-text"
                />
                {errors.message && <p className="mt-1 text-xs text-accent-2">{errors.message}</p>}
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" disabled={submitting}>
                  <Send size={16} /> {submitting ? "Sending..." : "Send Message"}
                </Button>
                {submitError && <p className="mt-3 text-sm text-accent-2">{submitError}</p>}
              </div>
            </form>
          )}
        </Card>
      </Container>
    </section>
  );
}
