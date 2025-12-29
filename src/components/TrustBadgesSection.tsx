import { motion } from "framer-motion";
import { Shield, Database, Award, Lock, Microscope } from "lucide-react";

const badges = [
  { icon: Shield, label: "100% Secure" },
  { icon: Database, label: "Science-Backed" },
  { icon: Award, label: "Made in India" },
  { icon: Lock, label: "Privacy First" },
  { icon: Microscope, label: "Trusted Research" },
];

export function TrustBadgesSection() {
  return (
    <section className="py-16 lg:py-20 bg-background border-y border-border/60">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Trusted by conscious shoppers
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-3 group cursor-default"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-secondary border border-border">
                  <badge.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-sm whitespace-nowrap transition-colors duration-300 text-foreground/80">
                  {badge.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
