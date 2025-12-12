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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function WhyPurelyticsSection() {
  return (
    <section id="why-purelytics" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20 pointer-events-none" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block text-primary font-semibold mb-4 tracking-wide text-sm uppercase">Why Purelytics</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-[-0.02em]">
            Transparency you can trust
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're building the ingredient transparency platform that consumers deserve.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="bg-card rounded-2xl p-7 lg:p-8 shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-border group hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-foreground mb-2.5">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}