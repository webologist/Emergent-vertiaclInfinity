import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";
import { SERVICE_INDEX as SERVICE_INDEX_DEFAULT, RELATED_SERVICES } from "@/data/services";
import { useContent } from "@/cms/CmsContext";

export default function RelatedServices({ slug }) {
  const SERVICE_INDEX = useContent("services", SERVICE_INDEX_DEFAULT);
  const related = (RELATED_SERVICES[slug] || []).map((k) => SERVICE_INDEX[k]).filter(Boolean);
  if (!related.length) return null;

  return (
    <section className="border-t border-white/10 py-20 md:py-28" data-testid={`${slug}-related-services`}>
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="overline">Keep exploring</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl lg:text-5xl">
                Services that pair well with this.
              </h2>
            </div>
            <Link
              to="/#focus"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-dim transition-colors hover:text-crimson"
              data-testid={`${slug}-all-services-link`}
            >
              All services
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-4 md:grid-cols-3">
          {related.map((s) => (
            <motion.div key={s.path} variants={staggerItem}>
              <Link
                to={s.path}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-crimson"
                data-testid={`related-service-${s.path.slice(1)}`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-crimson transition-colors duration-300 group-hover:bg-crimson group-hover:text-cwhite">
                  <s.icon size={20} strokeWidth={1.7} />
                </div>
                <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{s.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dim">{s.blurb}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
                  Explore
                  <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
