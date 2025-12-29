import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const trustPoints = ["Free during beta", "No app install needed", "100% private & secure"];

export function HeroSection() {
  return (
    <header className="relative pt-28 pb-16 sm:pb-20 md:pt-32 lg:pt-40 lg:pb-28 bg-background overflow-hidden">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-56 w-56 md:h-80 md:w-80 rounded-full bg-secondary blur-[100px] opacity-70" />
        <div className="absolute right-0 top-0 h-64 w-64 md:h-96 md:w-96 rounded-full bg-secondary blur-[120px] opacity-60" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] text-foreground">
            Scan any product.
            <span className="block text-primary mt-1">Instantly know what's inside.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Purelytics decodes ingredients, reveals toxicity, and suggests safer alternatives — in seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/beta"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center justify-center h-13 px-8 rounded-full btn-primary text-base font-semibold"
            >
              Get Early Access
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center h-13 px-8 rounded-full btn-secondary text-base font-medium"
            >
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 justify-center">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-5 h-5 rounded-full flex items-center justify-center bg-secondary border border-border">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                {point}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
