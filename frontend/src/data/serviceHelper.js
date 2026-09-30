export const SITUATIONS = [
  { id: "idea", label: "I have an idea that needs building", service: "product-development", why: "You need a partner to take it from concept to a launched product you own outright." },
  { id: "manual", label: "My team does repetitive manual work", service: "workflow-automation", why: "The fastest win is connecting your tools so the busywork runs itself." },
  { id: "legacy", label: "Our current system is old or hard to change", service: "legacy-modernization", why: "A phased rebuild lowers risk while adding the capability you're missing." },
  { id: "ai", label: "I want to put AI to work in my business", service: "ai-automation", why: "Practical assistants and agents wired into the systems you already use." },
  { id: "ux", label: "Our product looks dated or users struggle", service: "experience-design", why: "Research-led UX and UI that turns friction into conversion." },
  { id: "sell", label: "I sell online — or want to start", service: "digital-commerce", why: "Storefront, catalog and checkout built around how your customers buy." },
  { id: "slow", label: "Our site or app is slow or ranks poorly", service: "performance-services", why: "Speed, Core Web Vitals and SEO fixes that show up in the numbers." },
  { id: "care", label: "I need someone to look after what we have", service: "managed-support", why: "Monitoring, maintenance and steady improvements — without hiring a team." },
  // Maintenance
  { id: "bugs", label: "Our website or app keeps breaking and needs fixing", service: "managed-support", why: "A maintenance retainer with fast bug fixes, monitoring and a named engineer who knows your stack — so issues get fixed before customers notice." },
  { id: "updates", label: "We need regular updates, backups and security patches", service: "managed-support", why: "Scheduled updates, patching, backups and uptime monitoring handled for you, with a monthly health report so nothing silently rots." },
  // Administration
  { id: "hosting", label: "Domain, hosting or email administration", service: "managed-support", why: "We manage renewals, DNS, hosting, SSL and business email end to end — one accountable team instead of five vendor logins." },
  { id: "accounts", label: "User accounts, access and vendor administration", service: "managed-support", why: "Onboarding/offboarding, access control, licences and vendor coordination handled as a service, with a clear audit trail." },
];

export const PRIORITIES = [
  { id: "speed", label: "Speed to launch", note: "We scope a lean first release and ship in weeks, not quarters." },
  { id: "cost", label: "Lower cost & effort", note: "We size the work to your budget and automate whatever we can." },
  { id: "reliability", label: "Reliability & security", note: "Stabilise first, then improve — with monitoring from day one." },
  { id: "growth", label: "Growth & revenue", note: "Every decision tied to conversion, retention and revenue." },
];
