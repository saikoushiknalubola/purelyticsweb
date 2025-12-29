import { motion } from "framer-motion";
import { Shield, Database, Award, Lock, Microscope, CheckCircle } from "lucide-react";

const badges = [
  { icon: Shield, label: "100% Secure" },
  { icon: Database, label: "Science-Backed" },
  { icon: Award, label: "Made in India" },
  { icon: Lock, label: "Privacy First" },
  { icon: Microscope, label: "Trusted Research" },
];

export function TrustBadgesSection() {
  return (
    <section className="py-16 lg:py-20 bg-charcoal border-y border-primary-foreground/10">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Section label */}
          <p className="text-primary-foreground/50 text-sm font-medium uppercase tracking-wider">
            Trusted by thousands of conscious shoppers
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-foreground/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-sm whitespace-nowrap">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
