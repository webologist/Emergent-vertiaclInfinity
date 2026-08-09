import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, Mail, ArrowUpRight, Loader2, Check } from "lucide-react";
import { CONTACT } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const DETAILS = [
  { icon: MapPin, label: "Registered Office", value: CONTACT.address },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp },
  { icon: Mail, label: "Email", value: CONTACT.email },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", topic: "General" });
  const [status, setStatus] = useState("idle"); // idle | loading | done

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("done");
      toast.success("Message received — we'll be in touch over coffee soon.");
      setForm({ name: "", email: "", company: "", message: "", topic: "General" });
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Something went wrong. Please try again.");
    }
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&output=embed`;

  return (
    <section id="contact" className="relative border-t border-white/10 py-24 md:py-36" data-testid="contact-section">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-3">
            <span className="overline">{CONTACT.overline}</span>
            <h2 className="font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-7xl">
              {CONTACT.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left: details + map */}
          <Reveal>
            <div className="flex h-full flex-col gap-6">
              <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                {DETAILS.map((d) => (
                  <div key={d.label} className="flex items-start gap-4 bg-surface p-6" data-testid={`contact-${d.label.split(" ")[0].toLowerCase()}`}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-crimson">
                      <d.icon size={18} strokeWidth={1.7} />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-widest text-dim">{d.label}</div>
                      <div className="mt-1 text-sm text-white">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  title="Vertical Infinity location"
                  src={mapSrc}
                  className="map-dark h-[280px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  data-testid="contact-map"
                />
              </div>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={submit}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-elevated p-8 md:p-10"
              data-testid="contact-form"
            >
              <div className="mb-6 flex flex-wrap gap-2">
                {CONTACT.topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, topic: t }))}
                    data-testid={`topic-${t.split(" ")[0].toLowerCase()}`}
                    className={`rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 ${
                      form.topic === t
                        ? "border-crimson bg-crimson text-cwhite"
                        : "border-white/15 text-dim hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name*">
                  <Input value={form.name} onChange={update("name")} placeholder="Jane Doe" data-testid="contact-name-input" className="border-white/15 bg-transparent focus-visible:ring-crimson" />
                </Field>
                <Field label="Email*">
                  <Input type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com" data-testid="contact-email-input" className="border-white/15 bg-transparent focus-visible:ring-crimson" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Company">
                  <Input value={form.company} onChange={update("company")} placeholder="Company Inc." data-testid="contact-company-input" className="border-white/15 bg-transparent focus-visible:ring-crimson" />
                </Field>
              </div>
              <div className="mt-4 flex-1">
                <Field label="Message*">
                  <Textarea value={form.message} onChange={update("message")} placeholder="Tell us what you're building…" rows={5} data-testid="contact-message-input" className="resize-none border-white/15 bg-transparent focus-visible:ring-crimson" />
                </Field>
              </div>

              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileTap={{ scale: 0.98 }}
                data-testid="contact-submit-btn"
                className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-crimson px-6 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink disabled:opacity-60"
              >
                {status === "loading" && <Loader2 size={16} className="animate-spin" />}
                {status === "done" && <Check size={16} />}
                {status === "idle" ? "Schedule a meeting" : status === "loading" ? "Sending…" : "Sent!"}
                {status === "idle" && (
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </motion.button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs uppercase tracking-widest text-dim">{label}</span>
    {children}
  </label>
);
