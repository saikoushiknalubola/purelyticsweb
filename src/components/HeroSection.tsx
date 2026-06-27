import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const trustPoints = ["Free during beta", "No app install needed", "100% private & secure"];

const wordAnimation = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.15 + i * 0.09,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function AnimatedText({
  text,
  className,
  offset = 0,
}: {
  text: string;
  className?: string;
  offset?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-baseline mr-[0.25em]">
          <motion.span
            custom={i + offset}
            variants={wordAnimation}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function HeroSection() {
  return (
    <header className="relative pt-28 pb-16 sm:pb-20 md:pt-32 lg:pt-40 lg:pb-28 bg-background overflow-hidden">
      {/* Ambient background — breathing blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 top-24 h-56 w-56 md:h-80 md:w-80 rounded-full bg-secondary blur-[100px]"
          animate={{ opacity: [0.5, 0.75, 0.5], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-0 top-0 h-64 w-64 md:h-96 md:w-96 rounded-full bg-accent/30 blur-[120px]"
          animate={{ opacity: [0.4, 0.65, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-72 w-[60%] rounded-full bg-primary/10 blur-[140px]"
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
      </div>

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-foreground">
            <AnimatedText text="Scan any product." />
            <span className="block text-primary mt-1">
              <AnimatedText text="Instantly know what's inside." offset={3} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            Purelytics decodes ingredients, reveals toxicity, and suggests safer alternatives — in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center px-4 sm:px-0"
          >
            <Link
              to="/beta"
              onClick={() => window.scrollTo(0, 0)}
              className="group w-full sm:w-auto inline-flex items-center justify-center h-12 sm:h-[52px] px-8 sm:min-w-[180px] rounded-full btn-primary text-base font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
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
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.9 } } }}
            className="mt-10 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:items-center sm:gap-6 justify-center max-w-lg mx-auto sm:max-w-none"
          >
            {trustPoints.map((point) => (
              <motion.div
                key={point}
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left"
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-secondary border border-border flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground">{point}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
