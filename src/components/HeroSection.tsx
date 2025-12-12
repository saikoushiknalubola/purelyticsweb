import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Scan, Shield, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const trustPoints = [
  "Free during beta",
  "No app install needed", 
  "100% private & secure",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-soft-blue/[0.03] rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/[0.08] border border-primary/20 text-primary font-medium text-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Now accepting beta testers in India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] font-bold text-foreground leading-[1.08] mb-6 tracking-[-0.02em]"
            >
              Scan any product.{" "}
              <span className="text-primary relative">
                Instantly know
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C47.6667 2.16667 141 -1.4 199 5.5" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3"/>
                </svg>
              </span>{" "}
              what's inside.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Purelytics decodes ingredients, reveals toxicity, and recommends safer alternatives — all in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="hero" size="xl" asChild className="group">
                <a href="#beta">
                  Get Early Access
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="hero-outline" size="xl" asChild>
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 justify-center lg:justify-start"
            >
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {point}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="space-y-5">
              {/* Scan Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/60 hover:shadow-elevated hover:border-border transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <Scan className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1.5">Instant Scanning</h3>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                      Point your camera at any product label and get instant ingredient analysis
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Safety Score Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/60 hover:shadow-elevated hover:border-border transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-semibold text-foreground text-lg">Safety Score</h3>
                      <span className="text-2xl font-bold text-primary tabular-nums">92/100</span>
                    </div>
                    <p className="text-muted-foreground text-[15px] leading-relaxed mb-3">
                      Clear toxicity ratings help you make safer choices
                    </p>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Alert Card */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="bg-card rounded-2xl p-6 shadow-card border border-border/60 hover:shadow-elevated hover:border-border transition-all duration-500"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber/20 to-amber/5 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-7 h-7 text-amber" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="font-semibold text-foreground text-lg">1 Alert Found</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber/10 text-amber text-xs font-medium">Caution</span>
                    </div>
                    <p className="text-muted-foreground text-[15px] leading-relaxed">
                      <span className="font-medium text-foreground">Fragrance:</span> May contain allergens. Consider fragrance-free alternatives.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Subtle floating decoration */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[80px]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}