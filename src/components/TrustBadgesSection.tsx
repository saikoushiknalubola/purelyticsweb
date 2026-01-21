import { motion } from "framer-motion";
import { Award, Database, Lock, Microscope, Shield } from "lucide-react";

const badges = [
  { icon: Shield, label: "100% Secure" },
  { icon: Database, label: "Science-Backed" },
  { icon: Award, label: "Made in India" },
  { icon: Lock, label: "Privacy First" },
  { icon: Microscope, label: "Trusted Research" },
];

export function TrustBadgesSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background border-y border-border/60">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-wider text-muted-foreground text-center">
            Trusted by conscious shoppers
          </p>

          {/* Uniform grid on all screens */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="flex flex-col items-center gap-3 group cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-secondary border border-border">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-xs sm:text-sm text-center text-foreground/80 whitespace-nowrap">
                    {badge.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
