// Central content for the Vertical Infinity one-page site.

export const NAV = {
  brand: "Vertical Infinity",
  links: [
    { label: "What we do", href: "#focus" },
    { label: "Work", href: "#work" },
    { label: "Who we are", href: "#journey" },
    { label: "Get in touch", href: "#contact" },
  ],
};

export const HERO = {
  overline: "AI-Enabled Digital Agency",
  lines: ["Software that", "moves business", "forward."],
  accentWord: "forward.",
  sub: "We help SaaS, Education, Media & Publishing, and eCommerce organizations build high-performing digital platforms, connect complex systems, and scale with confidence.",
  cta: "Let's Chat Over Coffee",
  ctaHref: "#contact",
  stats: [
    { value: "20+", label: "Years building" },
    { value: "100%", label: "IP ownership" },
    { value: "4", label: "Industries served" },
  ],
};

export const FOCUS = {
  overline: "Our focused areas",
  title: "Unlock your stage",
  intro:
    "We've designed our entire process and products around everything your business needs — working with us is always quick, easy and hassle-free.",
  services: [
    {
      no: "01",
      title: "Workflow Automation",
      body: "Manual tasks and disconnected tools slow your business down. We build custom automated workflows that eliminate repetitive work, reduce human error, and keep your business running smoothly — saving your team hours every week.",
      icon: "Workflow",
    },
    {
      no: "02",
      title: "Product Development",
      body: "We turn your idea into a market-ready product without burning your budget or compromising your code. From initial concept to full technical execution, we build step-by-step while you retain 100% ownership of your IP.",
      icon: "Boxes",
    },
    {
      no: "03",
      title: "Legacy Modernization",
      body: "Outdated software makes your business vulnerable and slow. We inspect your tech stack to pinpoint what needs immediate patching, what requires a full rebuild, and how to update safely without breaking daily operations.",
      icon: "RefreshCcw",
    },
  ],
};

export const SME = {
  overline: "Power for SMEs",
  body: "Behind every SME is incredible grit, passion, and the courage to build something that lasts. Power for SMEs takes the weight off your shoulders — removing technical friction and giving you total clarity so you can focus on growing your business, empowering your team, and turning big ambitions into reality.",
  tags: [
    "Website Development",
    "Project Development",
    "Custom Applications",
    "Experiential Marketing",
    "Mini Apps",
  ],
};

export const GROWTH = {
  overline: "Drivers of our growth",
  quotes: [
    {
      text: "If you build a great experience, customers tell each other about that. Word of mouth is very powerful.",
      author: "Brian Chesky",
      role: "CEO, Airbnb",
    },
    {
      text: "The key is to set realistic customer expectations, and then not just meet them, but exceed them — preferably in unexpected and helpful ways.",
      author: "Richard Branson",
      role: "Founder, Virgin Group",
    },
  ],
  clients: ["NIMBUS", "Orbital", "Kadence", "VERITAS", "Loop", "Meridian", "Foundry", "Aperture"],
  reviews: {
    rating: "5.0",
    count: "180+",
    label: "Google reviews",
  },
};

export const JOURNEY = {
  overline: "We, our journey",
  chapters: [
    {
      no: "01",
      title: "Who We Are",
      body: "At Vertical Infinity, we blend sharp design, custom engineering, and lightning speed to help ambitious businesses scale. We've stripped away the typical agency friction — no bloated price tags, no rigid processes, no technical headaches. Instead, you get full ownership of your digital assets, transparent collaboration, and a long-term partner who stays in your corner long after launch.",
    },
    {
      no: "02",
      title: "Our Philosophy",
      body: "Your growth is the true measure of our success. We operate as a dedicated partner — listening closely to your goals, delivering uncompromised quality, and refining every detail until you're completely satisfied. By combining high-touch service with precision execution, we don't just deliver projects — we co-create the momentum your business needs to win.",
    },
    {
      no: "03",
      title: "Since 2003",
      body: "When we started out as Zxis back in 2003, we had a simple dream: to solve real problems with big ideas and a lot of heart. Over twenty years later, that spark has grown into Vertical Infinity Pvt. Ltd. While our name and scale have evolved, the passion that got us started hasn't changed one bit — we're still driven by curiosity, genuine connection, and a goal to keep reaching new heights together.",
    },
  ],
};

export const TEAM = {
  overline: "The humans behind it",
  title: "Team",
  members: [
    { name: "Arjun Mehta", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" },
    { name: "Priya Nair", role: "Head of Design", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop" },
    { name: "Rohan Kapoor", role: "Principal Engineer", img: "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?q=80&w=800&auto=format&fit=crop" },
    { name: "Sara Fernandes", role: "Product Lead", img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop" },
    { name: "Vikram Rao", role: "AI & Automation", img: "https://images.unsplash.com/photo-1609436132311-e4b0c9370469?q=80&w=800&auto=format&fit=crop" },
    { name: "Neha Sharma", role: "Client Partner", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop" },
  ],
};

export const CASE_STUDIES = {
  overline: "Selected work",
  title: "Proof, not promises.",
  intro:
    "A few of the platforms we've engineered end-to-end — from untangling legacy systems to shipping products that move the numbers that matter.",
  items: [
    {
      no: "01",
      client: "Meridian Health",
      title: "Legacy ERP to a cloud platform — without a single day offline",
      body: "A 14-year-old on-premise ERP was throttling a growing healthcare operator. We mapped every dependency, rebuilt the core as modular cloud services, and migrated in staged cut-overs so daily operations never stopped.",
      img: "https://static.prod-images.emergentagent.com/jobs/dc85d5e8-cf2f-4435-a796-5396dc27e178/images/1eefe9f4fe29b1ce355e90f3b62813cf552fc6aab4ead10d1f45fcd9183f8a97.jpeg",
      stats: [
        { value: "3.4x", label: "Faster daily operations" },
        { value: "99.98%", label: "Platform uptime" },
        { value: "0", label: "Days of downtime" },
      ],
      tags: ["Legacy Modernization", "Cloud Migration"],
    },
    {
      no: "02",
      client: "Kadence",
      title: "A D2C storefront rebuilt for speed — and conversion followed",
      body: "Kadence's storefront looked premium but loaded like a legacy site. We re-platformed to a headless commerce stack, cut page weight by 70%, and redesigned checkout down to two steps.",
      img: "https://static.prod-images.emergentagent.com/jobs/dc85d5e8-cf2f-4435-a796-5396dc27e178/images/4bc49629496689a4eec2517a2bca3ca542283100dde22f023886809c8c4bab53.jpeg",
      stats: [
        { value: "+68%", label: "Conversion rate" },
        { value: "0.6s", label: "Load time, from 2.1s" },
        { value: "+41%", label: "Average order value" },
      ],
      tags: ["eCommerce", "Product Development"],
    },
    {
      no: "03",
      client: "Orbital",
      title: "AI-driven workflows that gave a team its week back",
      body: "Orbital's ops team was drowning in copy-paste work across five disconnected tools. We built AI-assisted automation pipelines that route, reconcile, and report — with humans only approving the edge cases.",
      img: "https://static.prod-images.emergentagent.com/jobs/dc85d5e8-cf2f-4435-a796-5396dc27e178/images/4800bc74f31235a504a7a88552f58579ba47c1546767d3fa7674a9b24b9683d8.jpeg",
      stats: [
        { value: "1,200+", label: "Hours saved per year" },
        { value: "87%", label: "Fewer manual errors" },
        { value: "6 wks", label: "Concept to launch" },
      ],
      tags: ["Workflow Automation", "AI"],
    },
  ],
};

export const CONTACT = {
  overline: "We are always open",
  title: "Contact Human",
  address: "A803, Mandapeshwar Kripa, S.V.P. Road, Borivali West, Mumbai — 400103, INDIA",
  whatsapp: "+91 8950909589",
  email: "hello@verticalinfinity.in",
  mapQuery: "Mandapeshwar Kripa, S.V.P. Road, Borivali West, Mumbai 400103",
  topics: ["General", "New Project", "Automation", "Modernization", "Careers"],
};

export const FOOTER = {
  brand: "Vertical Infinity",
  columns: [
    {
      heading: "Explore",
      links: ["Our Focused Areas", "Power For SMEs", "Drivers of our Growth", "Who we are"],
    },
    {
      heading: "Company",
      links: ["Domain, Hosting, Email", "Jobs & Career", "Case Studies", "Social Responsibility"],
    },
    {
      heading: "Services",
      links: ["Platform Modernization", "Product Engineering", "AI & Automation", "Experience Design"],
    },
    {
      heading: "More",
      links: ["Digital Commerce", "Performance Services", "Managed Support", "Sitemap"],
    },
  ],
  badges: ["Udyam / MSME", "GeM Registered", "Make in India", "Startup India"],
  copyright: "© 2003–2026 Vertical Infinity Pvt. Ltd. All rights reserved.",
};

export const ASSETS = {
  heroBg: "https://static.prod-images.emergentagent.com/jobs/dc85d5e8-cf2f-4435-a796-5396dc27e178/images/88f29ea496d496bd8c8b7af9eb6da2c5267999a8e0c5f27199491693158f45e0.jpeg",
  crimson: "https://static.prod-images.emergentagent.com/jobs/dc85d5e8-cf2f-4435-a796-5396dc27e178/images/1d69c6ecb89a8a20d06e967b3bc0838386252dd26de16f04ae41101e19003667.jpeg",
};
