import { motion } from "framer-motion";
import { Zap, Globe, UserCheck, MessageCircle, Database, ShoppingBag } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Ingredient clarity in seconds",
    description: "No more guessing or searching. Get instant, accurate ingredient analysis.",
  },
  {
    icon: Globe,
    title: "India-first regulatory intelligence",
    description: "Built with India's regulatory landscape in mind, from FSSAI to CDSCO.",
  },
  {
    icon: UserCheck,
    title: "Personalized safety scoring",
    description: "Tailored analysis based on your specific allergies and sensitivities.",
  },
  {
    icon: MessageCircle,
    title: "Clean, honest explanations",
    description: "No jargon, no confusion — just clear answers in everyday language.",
  },
  {
    icon: Database,
    title: "Trustworthy scientific data",
    description: "Backed by peer-reviewed research and verified toxicity databases.",
  },
  {
    icon: ShoppingBag,
    title: "Built for everyday shoppers",
    description: "Whether you're a parent, health enthusiast, or casual buyer — we've got you.",
  },
];

export function WhyPurelyticsSection() {
  return (
    <section id="why-purelytics" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-primary font-semibold mb-3">Why Purelytics</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Transparency you can trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're building the ingredient transparency platform that consumers deserve.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 lg:p-8 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-green-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
