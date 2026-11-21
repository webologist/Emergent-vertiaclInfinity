import { useEffect } from "react";
import { useContent } from "@/cms/CmsContext";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Reveal } from "@/components/Reveal";
import { LEGAL_PAGES } from "@/data/legal";

const ORIGIN = "https://verticalinfinity.in";

export default function LegalPage({ page: pageDefault }) {
  const page = useContent(`legal.${pageDefault.slug}`, pageDefault);
  const canonical = `${ORIGIN}${page.path}`;
  const other = LEGAL_PAGES.find((p) => p.slug !== page.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page.path]);

  return (
    <>
      <title>{page.title}</title>
      <meta name="description" content={page.metaDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.metaDescription} />
      <meta property="og:url" content={canonical} />

      <Nav />
      <main data-testid={`${page.slug}-page`}>
        <section className="border-b border-white/10 pt-32 pb-14 md:pt-40 md:pb-20">
          <div className="container-x">
            <nav className="mb-8 flex items-center gap-2 text-xs text-dim" aria-label="Breadcrumb" data-testid={`${page.slug}-breadcrumb`}>
              <Link to="/" className="transition-colors hover:text-crimson">Home</Link>
              <ChevronRight size={12} />
              <span className="text-white">{page.heading}</span>
            </nav>
            <Reveal>
              <span className="overline">Legal</span>
              <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl" data-testid={`${page.slug}-heading`}>
                {page.heading}
              </h1>
              <p className="mt-4 text-sm text-dim" data-testid={`${page.slug}-updated`}>Last updated: {page.updated}</p>
              <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/85">{page.intro}</p>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-x grid gap-14 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-28 flex flex-col gap-1 border-l border-white/10 text-sm" aria-label="On this page" data-testid={`${page.slug}-toc`}>
                {page.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="-ml-px border-l border-transparent py-1.5 pl-4 text-dim transition-colors hover:border-crimson hover:text-white"
                  >
                    {s.title.replace(/^\d+\.\s/, "")}
                  </a>
                ))}
              </nav>
            </aside>

            <article className="max-w-3xl" data-testid={`${page.slug}-content`}>
              {page.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-white/10 py-9 first:border-t-0 first:pt-0">
                  <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">{s.title}</h2>
                  {s.paras?.map((p, i) => (
                    <p key={i} className="mt-4 text-base leading-relaxed text-white/80">{p}</p>
                  ))}
                  {s.bullets && (
                    <ul className="mt-4 flex flex-col gap-3">
                      {s.bullets.map((b, bi) => (
                        <li key={`b-${bi}`} className="flex gap-3 text-base leading-relaxed text-white/80">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" aria-hidden="true" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.paras2?.map((p, i) => (
                    <p key={i} className="mt-4 text-base leading-relaxed text-white/80">{p}</p>
                  ))}
                </section>
              ))}

              <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-elevated p-6">
                <span className="text-sm text-dim">Also read:</span>
                <Link
                  to={other.path}
                  className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-crimson"
                  data-testid={`${page.slug}-other-legal-link`}
                >
                  {other.heading}
                  <ArrowUpRight size={14} className="text-crimson transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
