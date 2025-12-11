import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import phoneMockup from "@/assets/phone-mockup-new.png";

const trustPoints = [
  "Free during beta",
  "No app install needed", 
  "100% private & secure",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-soft-blue/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-light border border-primary/20 text-primary font-medium text-sm mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now accepting beta testers in India
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight">
              Scan any product.{" "}
              <span className="text-primary">Instantly know</span> what's inside.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Purelytics decodes ingredients, reveals toxicity, and recommends safer alternatives — all in seconds.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <a href="#beta">
                  Get Early Access
                  <ArrowRight className="ml-2" />
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center lg:justify-start">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {point}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/15 blur-3xl rounded-full scale-75" />
              
              {/* Phone image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img
                  src={phoneMockup}
                  alt="Purelytics app showing ingredient analysis with safety score"
                  className="w-full drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating badges - positioned relative to phone container */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute left-0 top-[20%] -translate-x-[70%] glass-card rounded-2xl p-3 shadow-elevated hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Safety Score</p>
                    <p className="font-bold text-primary text-lg">92/100</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute right-0 bottom-[30%] translate-x-[70%] glass-card rounded-2xl p-3 shadow-elevated hidden sm:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">1 Alert</p>
                    <p className="font-semibold text-sm">Fragrance</p>
                  </div>
                </div>
              </motion.div>

              {/* Scan animation indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-2 glass-card rounded-full px-3 py-1.5 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">Scanning</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
