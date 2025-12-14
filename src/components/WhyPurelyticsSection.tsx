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
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function WhyPurelyticsSection() {
  return (
    <section id="why-purelytics" className="py-16 sm:py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-transparent to-secondary/20 pointer-events-none" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="container relative z-10 px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14 lg:mb-20"
        >
          <span className="inline-block text-primary font-semibold mb-3 sm:mb-4 tracking-wide text-xs sm:text-sm uppercase">Why Purelytics</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-5 tracking-[-0.02em] leading-tight">
            Transparency you can trust
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
            We're building the ingredient transparency platform that consumers deserve.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-7 shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-primary/30 group hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-500">
                <benefit.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 sm:mb-2.5 leading-snug">
                {benefit.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
