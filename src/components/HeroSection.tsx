import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import phoneMockup from "@/assets/phone-mockup-new.png";

const trustPoints = ["Free during beta", "No app install needed", "100% private & secure"];

const wordAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function AnimatedText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordAnimation}
          initial="hidden"
          animate="visible"
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroSection() {
  return (
    <header className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-32 lg:pt-36 lg:pb-24 bg-background overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-56 w-56 md:h-80 md:w-80 rounded-full bg-secondary blur-[100px] opacity-70" />
        <div className="absolute right-0 top-0 h-64 w-64 md:h-96 md:w-96 rounded-full bg-secondary blur-[120px] opacity-60" />
        <div className="absolute left-1/2 bottom-0 h-40 w-40 md:h-64 md:w-64 rounded-full bg-primary/10 blur-[80px] opacity-50" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-center lg:text-left order-1"
          >
            {/* Beta Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Now in Early Access</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] text-foreground">
              <AnimatedText text="Scan any product." />
              <span className="block text-primary mt-2">
                <AnimatedText text="Instantly know what's inside." className="delay-300" />
              </span>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Purelytics decodes ingredients, reveals toxicity, and suggests safer alternatives — in seconds.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
            >
              <Link
                to="/beta"
                onClick={() => window.scrollTo(0, 0)}
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-[52px] px-8 sm:min-w-[180px] rounded-full btn-primary text-base font-semibold group"
              >
                Get Early Access
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-[52px] px-8 sm:min-w-[180px] rounded-full btn-secondary text-base font-medium"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start"
            >
              {trustPoints.map((point, index) => (
                <motion.div 
                  key={point} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20 flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-2 flex justify-center lg:justify-end"
          >
            {/* Glow effect behind phone */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl" />
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 sm:left-4 top-1/4 bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-lg hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Safe Ingredients</p>
                  <p className="text-xs text-muted-foreground">12 found</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-4 sm:right-4 top-1/2 bg-background/90 backdrop-blur-sm border border-border rounded-2xl px-4 py-3 shadow-lg hidden sm:block"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">Review Needed</p>
                  <p className="text-xs text-muted-foreground">2 items</p>
                </div>
              </div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <img
                src={phoneMockup}
                alt="Purelytics app showing ingredient analysis"
                className="w-64 sm:w-72 md:w-80 lg:w-[340px] xl:w-[380px] h-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
