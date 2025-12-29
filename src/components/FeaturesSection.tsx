import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import illusScan from "@/assets/illus-scan.png";
import illusNurture from "@/assets/illus-nurture.png";
import illusJourney from "@/assets/illus-journey.png";

const features = [
  {
    illustration: illusScan,
    title: "Scan any product",
    subtitle: "Key features unveiled",
  },
  {
    illustration: illusNurture,
    title: "Understand ingredients",
    subtitle: "Essential features for safety",
  },
  {
    illustration: illusJourney,
    title: "Journey to wellness",
    subtitle: "Explore our powerful features",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Decorative sparkles */}
      <div aria-hidden="true" className="pointer-events-none absolute top-10 right-10 w-16 h-16 opacity-30">
        <svg viewBox="0 0 64 64" fill="none" className="w-full h-full text-accent">
          <path d="M32 0L34.5 29.5L64 32L34.5 34.5L32 64L29.5 34.5L0 32L29.5 29.5L32 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 lg:mb-18"
        >
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Features and benefits
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Practices such as mindful shopping and ingredient awareness can help you cultivate a sense of confidence and reduce anxiety.
          </p>
        </motion.div>

        {/* 3-column illustration cards like reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="rounded-[1.75rem] border-[6px] border-secondary bg-background p-5 sm:p-6 h-full flex flex-col">
                {/* Illustration */}
                <div className="flex items-center justify-center h-40 sm:h-48 lg:h-56 mb-5">
                  <img
                    src={feature.illustration}
                    alt={feature.title}
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Text */}
                <div className="text-center mt-auto">
                  <h3 className="font-display text-lg sm:text-xl text-foreground leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-display text-base sm:text-lg text-foreground/80 leading-snug mt-1">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learn more CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-center mt-12"
        >
          <Link
            to="/beta"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full btn-primary text-base font-semibold"
          >
            Learn more
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
