import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { ScanLine, FlaskConical, ShieldCheck, HeartHandshake } from "lucide-react";

const chapters = [
  {
    icon: ScanLine,
    chapter: "Chapter 01",
    title: "It started with a label nobody could read.",
    body:
      "A packet of biscuits. Eleven ingredients. Three of them banned in other countries. The label said ‘natural’ in bold — and hid the rest in 4pt grey. That's the moment Purelytics began.",
  },
  {
    icon: FlaskConical,
    chapter: "Chapter 02",
    title: "We went looking for the truth behind the fine print.",
    body:
      "Talking to food scientists, dermatologists, and toxicologists, one pattern kept repeating — the information exists, it's just buried under jargon, marketing, and outdated regulation.",
  },
  {
    icon: ShieldCheck,
    chapter: "Chapter 03",
    title: "So we built a system that reads labels the way experts do.",
    body:
      "ToxiScore™ decodes ingredients against peer-reviewed research, regulatory databases, and your personal profile — in seconds, in plain language, with the receipts to back it up.",
  },
  {
    icon: HeartHandshake,
    chapter: "Chapter 04",
    title: "Now we're handing that clarity to you.",
    body:
      "Purelytics isn't an app that tells you what to buy. It's a lens that shows you what's really there — so every choice you make is yours, informed, and unmistakably clear.",
  },
];

export function OurStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const lineScaleY = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);

  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 -left-24 w-80 h-80 rounded-full blur-[120px] bg-secondary opacity-60" />
        <div className="absolute bottom-20 -right-24 w-80 h-80 rounded-full blur-[120px] bg-accent/20" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-secondary border border-border text-foreground">
            Our Story
          </span>
          <AnimatedHeading className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            How Purelytics came to life
          </AnimatedHeading>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Four chapters. One belief — that everyone deserves to understand what they're putting in and on their body.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          {/* Vertical timeline rail */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-border/70"
            aria-hidden="true"
          />
          <motion.div
            style={{ scaleY: lineScaleY, transformOrigin: "top" }}
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-primary"
            aria-hidden="true"
          />

          <div className="space-y-14 md:space-y-24">
            {chapters.map((c, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={c.chapter}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="relative md:grid md:grid-cols-2 md:gap-12 items-center"
                >
                  {/* Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
                    className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 w-12 h-12 rounded-full bg-background border-2 border-primary items-center justify-center z-10 shadow-md"
                  >
                    <c.icon className="w-5 h-5 text-primary" />
                  </motion.div>

                  {/* Card */}
                  <div
                    className={`glass-card rounded-2xl p-6 sm:p-7 ${
                      isLeft ? "md:col-start-1 md:pr-10 md:text-right" : "md:col-start-2 md:pl-10"
                    }`}
                  >
                    <div className={`flex items-center gap-3 mb-3 md:hidden`}>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <c.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                        {c.chapter}
                      </span>
                    </div>
                    <span className="hidden md:inline-block text-xs font-semibold tracking-wider uppercase text-primary mb-2">
                      {c.chapter}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl text-foreground mb-3 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}