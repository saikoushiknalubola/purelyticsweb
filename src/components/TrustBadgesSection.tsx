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
    <section className="py-12 lg:py-16 bg-secondary/50 border-y border-border/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-16"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <badge.icon className="w-5 h-5 text-primary" />
              <span className="font-medium text-sm whitespace-nowrap">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
