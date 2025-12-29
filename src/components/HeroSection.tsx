import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import phoneMockup from "@/assets/phone-mockup.png";

export function HeroSection() {
  return (
    <section className="relative pt-24 lg:pt-28 pb-14 lg:pb-20 bg-background overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-foreground">
              Take control of your
              <span className="block text-primary">product safety</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Scan any label and instantly understand ingredients, toxicity flags, and safer alternatives — built for
              everyday shoppers in India.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-8">
              <div>
                <div className="text-sm text-muted-foreground">Trusted scans</div>
                <div className="font-display text-3xl text-foreground">50K+</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Early users</div>
                <div className="font-display text-3xl text-foreground">3000+</div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#beta"
                className="inline-flex items-center justify-center h-12 px-7 rounded-full btn-primary"
              >
                Get Early Access
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center h-12 px-7 rounded-full btn-secondary"
              >
                Learn more
              </a>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="panel-olive relative rounded-[2rem] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-glow">
              {/* subtle star-ish pattern */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.10]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.45) 2px, transparent 3px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.35) 2px, transparent 3px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.25) 1.5px, transparent 3px)",
                  backgroundSize: "240px 240px",
                }}
              />

              <div className="relative">
                <div className="flex justify-end mb-6">
                  <a
                    href="#beta"
                    className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-accent text-accent-foreground font-semibold"
                  >
                    Download app
                  </a>
                </div>

                <div className="relative flex items-center justify-center">
                  <img
                    src={phoneMockup}
                    alt="Purelytics ingredient scanner app preview"
                    className="w-[280px] sm:w-[320px] lg:w-[360px] drop-shadow-[0_28px_60px_rgba(0,0,0,0.35)]"
                    loading="eager"
                  />

                  {/* Floating cards */}
                  <div className="hidden sm:block absolute -left-8 top-10 w-[260px] glass-card rounded-2xl p-4 animate-float">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-semibold text-primary">
                        P
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Self care & relaxation</div>
                        <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
                          <div className="h-full w-[78%] bg-primary rounded-full" />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Completed 80%</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute -right-6 top-28 w-[260px] glass-card rounded-2xl p-4 animate-float-slow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-semibold text-primary">
                        P
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Scan ingredients</div>
                        <div className="mt-2 h-2 rounded-full bg-background overflow-hidden">
                          <div className="h-full w-[52%] bg-primary rounded-full" />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Analyzing label…</div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:block absolute -right-2 bottom-10 w-[270px] glass-card rounded-2xl p-4 animate-float">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">Safety score</div>
                        <div className="font-display text-3xl text-primary">92</div>
                      </div>
                      <div className="text-xs px-3 py-1 rounded-full bg-background text-foreground border border-border">
                        Clean
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
