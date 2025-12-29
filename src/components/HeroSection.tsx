import { motion } from "framer-motion";
import { ArrowRight, Apple, Play } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";

export function HeroSection() {
  return (
    <section className="relative pt-24 lg:pt-28 pb-14 lg:pb-20 bg-background overflow-hidden">
      {/* soft background sparkles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-secondary blur-[70px] opacity-70" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-secondary blur-[90px] opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 22%, hsl(var(--secondary-foreground) / 0.18) 2px, transparent 3px), radial-gradient(circle at 78% 18%, hsl(var(--secondary-foreground) / 0.10) 2px, transparent 3px), radial-gradient(circle at 62% 74%, hsl(var(--secondary-foreground) / 0.10) 2px, transparent 3px)",
            backgroundSize: "260px 260px",
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.02] text-foreground">
              Take control of your
              <span className="block text-primary">product safety</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Scan any label and instantly understand ingredients, toxicity flags, and safer alternatives — built for
              everyday shoppers in India.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-10">
              <div>
                <div className="text-sm text-muted-foreground">Active users</div>
                <div className="font-display text-3xl text-foreground">3000+</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Scans decoded</div>
                <div className="font-display text-3xl text-foreground">50K</div>
              </div>
            </div>

            {/* Store buttons like reference */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#beta"
                className="inline-flex items-center justify-center gap-3 h-12 px-6 rounded-2xl bg-foreground text-background"
              >
                <Apple className="w-5 h-5" />
                <span className="text-sm font-semibold">Download on the App Store</span>
              </a>
              <a
                href="#beta"
                className="inline-flex items-center justify-center gap-3 h-12 px-6 rounded-2xl bg-foreground text-background"
              >
                <Play className="w-5 h-5" />
                <span className="text-sm font-semibold">GET IT ON Google Play</span>
              </a>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href="#beta" className="inline-flex items-center justify-center h-12 px-7 rounded-full btn-primary">
                Get Early Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center h-12 px-7 rounded-full btn-secondary">
                Learn more
              </a>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="panel-olive relative rounded-[2.5rem] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-glow">
              {/* star-ish pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.45) 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35) 2px, transparent 3px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 1.5px, transparent 3px)",
                  backgroundSize: "240px 240px",
                }}
              />

              <div className="relative">
                <div className="flex justify-end mb-6">
                  <a href="#beta" className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-accent text-accent-foreground font-semibold">
                    Download app
                  </a>
                </div>

                {/* inner cream card like reference */}
                <div className="relative rounded-[2rem] bg-background border border-border/60 p-8 sm:p-10">
                  <div className="relative flex items-center justify-center">
                    <img
                      src={phoneMockup}
                      alt="Purelytics ingredient scanner app preview"
                      className="w-[260px] sm:w-[300px] lg:w-[340px] drop-shadow-[0_24px_50px_rgba(0,0,0,0.35)]"
                      loading="eager"
                    />

                    {/* Floating cards crossing out of the panel */}
                    <div className="hidden sm:block absolute -left-20 top-8 w-[260px] glass-card rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-semibold text-primary">P</div>
                        <div className="w-full">
                          <div className="text-sm font-semibold text-foreground">Self care & relaxation</div>
                          <div className="mt-2 h-2 rounded-full bg-background overflow-hidden border border-border">
                            <div className="h-full w-[78%] bg-primary rounded-full" />
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">Completed 80%</div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block absolute -right-24 top-24 w-[270px] glass-card rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-semibold text-primary">P</div>
                        <div className="w-full">
                          <div className="text-sm font-semibold text-foreground">Scan ingredients</div>
                          <div className="mt-2 h-2 rounded-full bg-background overflow-hidden border border-border">
                            <div className="h-full w-[52%] bg-primary rounded-full" />
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">Analyzing label…</div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block absolute -right-10 -bottom-10 w-[280px] glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-foreground">Safety score</div>
                          <div className="font-display text-3xl text-primary">92</div>
                        </div>
                        <div className="text-xs px-3 py-1 rounded-full bg-background text-foreground border border-border">Clean</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
