const COMPANY = "Vertical Infinity Pvt. Ltd.";
const SITE = "https://verticalinfinity.in";
const EMAIL = "hello@verticalinfinity.in";
const ADDRESS = "A803, Mandapeshwar Kripa, S.V.P. Road, Borivali West, Mumbai — 400103, Maharashtra, India";
const UPDATED = "25 September 2026";

export const PRIVACY_POLICY = {
  slug: "privacy-policy",
  path: "/privacy-policy",
  title: "Privacy Policy | Vertical Infinity",
  metaDescription:
    "How Vertical Infinity Pvt. Ltd. collects, uses and protects the personal information you share through verticalinfinity.in — contact forms, analytics cookies and email.",
  heading: "Privacy Policy",
  intro: `${COMPANY} ("Vertical Infinity", "we", "us") respects your privacy. This policy explains what information we collect when you use ${SITE} (the "Site"), how we use it, and the choices you have. It is written to comply with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 and the Digital Personal Data Protection Act, 2023.`,
  updated: UPDATED,
  sections: [
    {
      id: "what-we-collect",
      title: "1. Information we collect",
      paras: ["We collect only what we need to respond to you and to keep the Site running well:"],
      bullets: [
        "Information you give us — when you submit a contact or enquiry form we collect your name, email address, company name (optional), the topic you select and your message.",
        "Technical information — when you visit the Site our servers and analytics tools receive your IP address, browser type, device type, pages viewed, referring URL and approximate location (city level). We also record IP addresses for a short period to protect our contact form from abuse.",
        "Communications — if you email us, message us on WhatsApp or call us, we keep a record of that correspondence.",
      ],
    },
    {
      id: "how-we-use",
      title: "2. How we use your information",
      bullets: [
        "To reply to your enquiry and discuss your project.",
        "To send you information you have asked for, such as proposals or estimates.",
        "To operate, secure and improve the Site, including preventing spam and abuse of our forms.",
        "To understand how visitors use the Site (in aggregate) so we can improve our content and services.",
        "To comply with applicable law and enforce our Terms of Service.",
      ],
      paras: ["We do not sell your personal information, and we do not use it for automated decision-making that produces legal or similarly significant effects."],
    },
    {
      id: "cookies",
      title: "3. Cookies and analytics",
      paras: [
        "The Site uses Google Analytics 4 (provided by Google LLC) to measure traffic and usage. Google Analytics sets first-party cookies (for example _ga and _ga_*) that assign a random identifier to your browser and record page views and events. IP addresses are truncated by Google before storage. We do not enable advertising features or remarketing.",
        "You can opt out of Google Analytics by installing the Google Analytics opt-out browser add-on, by blocking cookies in your browser settings, or by using a content blocker. The Site works without cookies.",
        "We also store a single preference in your browser's local storage (\"vi-theme\") to remember whether you chose light or dark mode. It contains no personal data.",
      ],
    },
    {
      id: "sharing",
      title: "4. Who we share information with",
      paras: ["We share personal information only with service providers who process it on our behalf and under our instructions:"],
      bullets: [
        "Hosting and infrastructure providers that run the Site, its API and database.",
        "Email delivery providers used to notify our team when you submit an enquiry and to reply to you.",
        "Google LLC for analytics (see Section 3) and for Google Maps / Business Profile features embedded on the Site.",
        "Professional advisers, regulators or law-enforcement authorities where required by law or to protect our legal rights.",
      ],
      paras2: ["Some of these providers may store data outside India. Where they do, we rely on their contractual commitments to protect it to a standard consistent with this policy."],
    },
    {
      id: "retention",
      title: "5. How long we keep information",
      bullets: [
        "Enquiries and related correspondence: for as long as needed to respond and for up to 3 years afterwards, so we can pick up the conversation if you return.",
        "Anti-abuse IP records for the contact form: automatically deleted after 10 minutes.",
        "Analytics data: retained by Google Analytics according to our configured retention period (14 months) in aggregated form.",
      ],
    },
    {
      id: "security",
      title: "6. Security",
      paras: [
        "We use HTTPS across the Site, restrict access to enquiry data to authorised team members behind authenticated, rate-limited logins, and escape all user-supplied content before it is rendered or emailed. No method of transmission or storage is completely secure, but we work to protect your information with reasonable technical and organisational measures appropriate to its sensitivity.",
      ],
    },
    {
      id: "rights",
      title: "7. Your rights and choices",
      paras: ["Depending on where you live, you may have the right to:"],
      bullets: [
        "Access the personal information we hold about you and receive a copy.",
        "Ask us to correct information that is inaccurate or incomplete.",
        "Ask us to delete your information, subject to any legal obligation to retain it.",
        "Withdraw consent where our processing is based on consent.",
        "Nominate another person to exercise these rights on your behalf, as provided under the Digital Personal Data Protection Act, 2023.",
      ],
      paras2: [`To exercise any of these rights, email us at ${EMAIL}. We will respond within 30 days. If you are unhappy with our response you may raise a grievance with our Grievance Officer (details below) and, thereafter, with the Data Protection Board of India.`],
    },
    {
      id: "children",
      title: "8. Children",
      paras: ["The Site is intended for businesses and adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with personal information, please contact us and we will delete it."],
    },
    {
      id: "third-party",
      title: "9. Third-party links",
      paras: ["The Site links to third-party websites and services (for example Google Maps, WhatsApp and our domain and hosting partner). Their privacy practices are governed by their own policies, which we encourage you to read."],
    },
    {
      id: "changes",
      title: "10. Changes to this policy",
      paras: ["We may update this policy from time to time. The \"last updated\" date at the top shows when it last changed. Material changes will be highlighted on this page."],
    },
    {
      id: "contact",
      title: "11. Contact and Grievance Officer",
      paras: [
        `${COMPANY}`,
        ADDRESS,
        `Email: ${EMAIL}`,
        "Grievance Officer: Data Protection Officer, Vertical Infinity Pvt. Ltd. (reach via the email above with the subject line \"Privacy\").",
      ],
    },
  ],
};

export const TERMS_OF_SERVICE = {
  slug: "terms-of-service",
  path: "/terms-of-service",
  title: "Terms of Service | Vertical Infinity",
  metaDescription:
    "The terms that govern your use of verticalinfinity.in and the general basis on which Vertical Infinity Pvt. Ltd. provides its digital product, automation and design services.",
  heading: "Terms of Service",
  intro: `These Terms of Service ("Terms") govern your access to and use of ${SITE} (the "Site") operated by ${COMPANY} ("Vertical Infinity", "we", "us"). By using the Site you agree to these Terms. Paid engagements are governed by a separate written proposal, statement of work or master services agreement ("Engagement Agreement"); where the two conflict, the Engagement Agreement prevails for that engagement.`,
  updated: UPDATED,
  sections: [
    {
      id: "use-of-site",
      title: "1. Use of the Site",
      bullets: [
        "You may use the Site for lawful purposes to learn about our services and to contact us.",
        "You must not attempt to gain unauthorised access to any part of the Site, interfere with its operation, submit automated or bulk enquiries, scrape content at scale, or introduce malicious code.",
        "We may suspend or restrict access to the Site, or block abusive traffic, at any time without notice.",
      ],
    },
    {
      id: "enquiries",
      title: "2. Enquiries and proposals",
      paras: [
        "Submitting an enquiry through the Site does not create a contract. Any estimates, timelines or budgets we share in response are indicative until confirmed in an Engagement Agreement signed or accepted in writing by both parties.",
        "We will treat the information you share in an enquiry as confidential and use it only to evaluate and respond to your request, in line with our Privacy Policy.",
      ],
    },
    {
      id: "services",
      title: "3. Our services",
      paras: ["Vertical Infinity provides digital product development, workflow automation, legacy modernisation, AI and automation, experience design, digital commerce, performance and managed-support services. For each engagement the scope, deliverables, fees, payment schedule, timelines and acceptance criteria are set out in the Engagement Agreement. Unless that agreement says otherwise:"],
      bullets: [
        "Fees are quoted in Indian Rupees (INR) exclusive of GST and other applicable taxes, which are charged additionally.",
        "Invoices are payable within the period stated on the invoice. We may pause work on overdue accounts after notice.",
        "You will provide timely access, content, approvals and decisions needed for us to deliver; delays on your side may shift timelines.",
        "Third-party services you choose (cloud hosting, SaaS licences, domains, app-store fees, payment gateways) are contracted and paid by you unless we agree to resell them.",
      ],
    },
    {
      id: "ip",
      title: "4. Intellectual property",
      bullets: [
        "Your IP stays yours. On payment in full for an engagement, all bespoke code, designs and content we create for you under that engagement are assigned to you (or licensed to you as set out in the Engagement Agreement).",
        "We retain ownership of our pre-existing tools, libraries, frameworks, know-how and generic components, and grant you a perpetual, royalty-free licence to use them as part of the deliverables.",
        "Open-source components remain subject to their own licences.",
        "The Site, its design, text, graphics, logos and the Vertical Infinity name and marks are owned by us or our licensors and may not be reproduced without permission, except for fair personal or non-commercial use with attribution.",
        "Unless you tell us otherwise in writing, we may name you as a client and show non-confidential work in our portfolio after launch.",
      ],
    },
    {
      id: "confidentiality",
      title: "5. Confidentiality",
      paras: ["Each party will keep the other's non-public business, technical and financial information confidential, use it only for the purposes of the engagement, and protect it with at least reasonable care. This obligation survives the end of any engagement for 3 years, and indefinitely for trade secrets and personal data."],
    },
    {
      id: "warranties",
      title: "6. Warranties and disclaimers",
      paras: [
        "We warrant that services will be performed with reasonable skill and care by suitably qualified people, and that deliverables will materially conform to the agreed specification for the warranty period set out in the Engagement Agreement (30 days after acceptance if none is stated). Our sole obligation for breach of this warranty is to correct the non-conformance at no charge.",
        "The Site and its content are provided \"as is\" for general information. We do not warrant that the Site will be uninterrupted or error-free, or that information on it (including indicative pricing, timelines or third-party ratings) is complete or current. Nothing on the Site constitutes legal, financial or professional advice.",
      ],
    },
    {
      id: "liability",
      title: "7. Limitation of liability",
      paras: [
        "To the maximum extent permitted by law, neither party is liable to the other for indirect, incidental, special or consequential loss, loss of profit, revenue, data or goodwill, however arising.",
        "Our total aggregate liability arising out of or in connection with an engagement is limited to the fees paid by you for that engagement in the 12 months preceding the claim. Our liability in connection with use of the Site itself is limited to INR 10,000.",
        "Nothing in these Terms limits liability for death or personal injury caused by negligence, fraud, wilful misconduct, or any liability that cannot be limited under applicable law.",
      ],
    },
    {
      id: "termination",
      title: "8. Termination",
      paras: ["Either party may terminate an engagement for material breach not cured within 30 days of written notice, or for convenience on the notice period stated in the Engagement Agreement. On termination you will pay for work performed up to the termination date, and we will hand over completed deliverables and work-in-progress that have been paid for."],
    },
    {
      id: "law",
      title: "9. Governing law and disputes",
      paras: ["These Terms and any dispute arising from them are governed by the laws of India. The courts at Mumbai, Maharashtra have exclusive jurisdiction, subject to any arbitration clause in an Engagement Agreement. Before starting proceedings, the parties will try in good faith to resolve the dispute through discussion between senior representatives for at least 30 days."],
    },
    {
      id: "general",
      title: "10. General",
      bullets: [
        "If any provision of these Terms is held invalid, the rest remain in effect.",
        "Neither party is liable for delay caused by events beyond its reasonable control (force majeure), provided it notifies the other promptly.",
        "These Terms, the Privacy Policy and any Engagement Agreement form the entire agreement between us regarding their subject matter.",
        "We may update these Terms from time to time; the version published on the Site at the time you use it applies. Engagement Agreements are governed by the Terms in force when they were signed.",
      ],
    },
    {
      id: "contact",
      title: "11. Contact",
      paras: [`${COMPANY}`, ADDRESS, `Email: ${EMAIL}`],
    },
  ],
};

export const LEGAL_PAGES = [PRIVACY_POLICY, TERMS_OF_SERVICE];
