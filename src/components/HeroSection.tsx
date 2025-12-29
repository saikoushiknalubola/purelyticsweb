import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import phoneMockup from "@/assets/phone-mockup-new.png";

const trustPoints = [
  "Free during beta",
  "No app install needed", 
  "100% private & secure",
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Radial glow */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)' }} />
      
      <div className="container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center lg:text-left z-10"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', color: '#22c55e' }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#22c55e' }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#22c55e' }}></span>
                </span>
                Now accepting beta testers in India
              </span>
            </motion.div>

            {/* Headline - EXACT Yozu style */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[3rem] sm:text-[3.5rem] lg:text-[4.25rem] xl:text-[5rem] font-extrabold leading-[1.05] mb-6 tracking-[-0.04em]"
              style={{ color: 'white' }}
            >
              Scan any product.
              <br />
              <span className="italic" style={{ color: '#22c55e' }}>Instantly know</span>
              <br />
              what's inside.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg lg:text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              style={{ color: 'rgba(255, 255, 255, 0.6)' }}
            >
              Purelytics decodes ingredients, reveals toxicity, and recommends safer alternatives — all in seconds.
            </motion.p>

            {/* CTA Buttons - Yozu style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a 
                href="#beta"
                className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full text-base font-bold transition-all duration-300 group"
                style={{ 
                  background: '#22c55e', 
                  color: '#0f172a',
                  boxShadow: '0 0 30px -5px rgba(34, 197, 94, 0.5)'
                }}
              >
                Get Early Access
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#how-it-works"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full text-base font-semibold transition-all duration-300"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                See How It Works
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 justify-center lg:justify-start"
            >
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2.5 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                    <Check className="w-3 h-3" style={{ color: '#22c55e' }} />
                  </div>
                  {point}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone with Floating Cards (Yozu Style) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative flex justify-center lg:justify-end items-center"
          >
            <div className="relative">
              {/* Phone mockup - tilted like Yozu */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
                style={{ transform: 'rotate(-6deg)' }}
              >
                <img 
                  src={phoneMockup} 
                  alt="Purelytics App" 
                  className="w-[280px] sm:w-[320px] lg:w-[380px]"
                  style={{ filter: 'drop-shadow(0 50px 100px rgba(0, 0, 0, 0.5))' }}
                />
              </motion.div>

              {/* Floating Card 1 - Top Left (Receive Money Style) */}
              <motion.div
                initial={{ opacity: 0, x: -50, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute -left-16 sm:-left-28 lg:-left-36 top-4 sm:top-8"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-card rounded-2xl p-5 min-w-[220px]"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                      <ArrowDown className="w-6 h-6" style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Scanning...</p>
                      <p className="text-lg font-bold text-white">Analyzing Label</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card 2 - Right (Safety Score) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -right-8 sm:-right-20 lg:-right-32 top-1/3"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="glass-card rounded-2xl p-5 min-w-[200px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                      <ArrowUp className="w-5 h-5" style={{ color: '#22c55e' }} />
                    </div>
                    <span className="text-white font-semibold">Safety Score</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>92</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>/100</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      transition={{ delay: 1.8, duration: 1.2 }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #22c55e, #4ade80)' }}
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating Card 3 - Bottom Left (Alert) */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute -left-8 sm:-left-20 lg:-left-28 bottom-20 sm:bottom-28"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="glass-card rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                      <DollarSign className="w-5 h-5" style={{ color: '#fbbf24' }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">1 Alert</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24' }}>Caution</span>
                      </div>
                      <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Contains fragrance</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
