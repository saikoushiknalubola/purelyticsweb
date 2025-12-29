import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Zap, TrendingUp, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import phoneMockup from "@/assets/phone-mockup-new.png";

const trustPoints = [
  "Free during beta",
  "No app install needed", 
  "100% private & secure",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-0 overflow-hidden bg-navy">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light/50 to-navy" />
      
      {/* Radial glow behind phone */}
      <div className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[800px] h-[800px] bg-mint/[0.08] rounded-full blur-[150px]" />
      <div className="absolute top-1/3 right-[30%] w-[400px] h-[400px] bg-mint/[0.05] rounded-full blur-[100px]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left pt-8 lg:pt-0"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-mint/10 border border-mint/30 text-mint font-semibold text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-mint"></span>
                </span>
                Now accepting beta testers in India
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-bold text-white leading-[1.05] mb-6 tracking-[-0.03em]"
            >
              Scan any product.
              <br />
              <span className="text-mint italic">Instantly know</span>
              <br />
              what's inside.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-lg lg:text-xl text-white/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              Purelytics decodes ingredients, reveals toxicity, and recommends safer alternatives — all in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button 
                size="lg" 
                className="bg-mint hover:bg-mint-light text-navy font-bold h-14 px-8 rounded-full text-base shadow-glow group"
                asChild
              >
                <a href="#beta">
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button 
                size="lg"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30 font-semibold h-14 px-8 rounded-full text-base backdrop-blur-sm"
                asChild
              >
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 justify-center lg:justify-start"
            >
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-sm text-white/50">
                  <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-mint" />
                  </div>
                  {point}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup with Floating Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end items-center min-h-[500px] lg:min-h-[600px]"
          >
            {/* Phone mockup */}
            <div className="relative">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src={phoneMockup} 
                  alt="Purelytics App" 
                  className="w-[260px] sm:w-[300px] lg:w-[340px] drop-shadow-2xl"
                />
              </motion.div>

              {/* Floating Card - Top Left - Receive Money Style */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-12 sm:-left-24 lg:-left-32 top-8 sm:top-12"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="glass-card rounded-2xl p-5 shadow-xl min-w-[200px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-mint/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-mint" />
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Scanning...</p>
                      <p className="text-white font-bold text-lg">Analyzing ingredients</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card - Right - Safety Score */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -right-8 sm:-right-20 lg:-right-28 top-1/3"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="glass-card rounded-2xl p-5 shadow-xl min-w-[180px]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-mint/20 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-mint" />
                      </div>
                      <span className="text-white/80 font-medium">Safety Score</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-mint">92</span>
                    <span className="text-white/40 text-sm mb-1">/100</span>
                  </div>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 1.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-mint to-mint-light rounded-full"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card - Bottom Left - Alert */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -left-6 sm:-left-16 lg:-left-24 bottom-16 sm:bottom-24"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="glass-card rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">1 Alert</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber/20 text-amber text-xs font-medium">Caution</span>
                      </div>
                      <p className="text-white/50 text-sm">Contains fragrance</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy to-transparent pointer-events-none" />
    </section>
  );
}
