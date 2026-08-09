import { motion } from "framer-motion";
import { TEAM } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";

export default function Team() {
  return (
    <section className="relative border-t border-white/10 py-24 md:py-36" data-testid="team-section">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="overline">{TEAM.overline}</span>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
                {TEAM.title}
              </h2>
            </div>
            <p className="max-w-xs text-sm text-dim">
              Curious minds, genuine connection, and a goal to keep reaching new heights — together.
            </p>
          </div>
        </Reveal>

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {TEAM.members.map((m) => (
            <motion.div
              key={m.name}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface"
              data-testid={`team-member-${m.name.split(" ")[0].toLowerCase()}`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="h-full w-full object-cover grayscale contrast-125 transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
                  draggable={false}
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 pt-12">
                <div className="translate-y-1 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="font-display text-base font-bold">{m.name}</div>
                  <div className="text-xs text-crimson">{m.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
