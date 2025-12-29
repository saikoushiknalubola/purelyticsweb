import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Scan, Shield, AlertTriangle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import phoneMockup from "@/assets/phone-mockup-new.png";

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
      staggerChildren: 0.12,
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
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden bg-charcoal">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-soft-blue/[0.05] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-primary/[0.05] rounded-full blur-[80px] translate-x-1/2" />
      </div>

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-primary/[0.12] border border-primary/30 text-primary font-semibold text-sm mb-8 backdrop-blur-sm">
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
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-display-lg font-bold text-primary-foreground leading-[1.05] mb-6 tracking-tight"
            >
              Scan any product.{" "}
              <span className="text-primary relative inline-block">
                Instantly know
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5.5C47.6667 2.16667 141 -1.4 199 5.5" stroke="hsl(152 76% 44%)" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.5"/>
                </svg>
              </span>{" "}
              what's inside.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg lg:text-xl text-primary-foreground/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Purelytics decodes ingredients, reveals toxicity, and recommends safer alternatives — all in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="xl" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow font-semibold group h-14 px-8 rounded-2xl"
                asChild
              >
                <a href="#beta">
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                size="xl"
                className="bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/20 hover:bg-primary-foreground/15 hover:border-primary-foreground/30 backdrop-blur-sm h-14 px-8 rounded-2xl"
                asChild
              >
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
                <div key={point} className="flex items-center gap-2.5 text-sm text-primary-foreground/60">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {point}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/[0.15] rounded-full blur-[80px]" />
            
            {/* Phone mockup */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src={phoneMockup} 
                  alt="Purelytics App Interface" 
                  className="w-[280px] sm:w-[320px] lg:w-[360px] drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating Card - Scan */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-4 sm:-left-16 lg:-left-24 top-16 sm:top-20"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="glass-premium rounded-2xl p-4 shadow-elevated max-w-[180px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Scan className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary-foreground text-sm">Scanning...</p>
                      <p className="text-primary-foreground/60 text-xs">Analyzing ingredients</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card - Safety Score */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-4 sm:-right-12 lg:-right-20 top-1/3"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="glass-premium rounded-2xl p-4 shadow-elevated max-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-primary-foreground text-sm">Safety Score</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">92</span>
                  </div>
                  <div className="h-2 bg-primary-foreground/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 1.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-primary to-green-medium rounded-full"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card - Alert */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-2 sm:-left-8 lg:-left-16 bottom-20 sm:bottom-24"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="glass-premium rounded-2xl p-4 shadow-elevated max-w-[200px]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-primary-foreground text-sm">1 Alert</p>
                        <span className="px-2 py-0.5 rounded-full bg-amber/20 text-amber text-xs font-medium">Caution</span>
                      </div>
                      <p className="text-primary-foreground/60 text-xs mt-0.5">Contains fragrance</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Sparkle decorations */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-6 bottom-12 text-primary/40"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute right-1/4 -top-4 text-primary/30"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent pointer-events-none" />
    </section>
  );
}
