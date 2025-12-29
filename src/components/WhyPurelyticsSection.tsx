import { motion } from "framer-motion";
import { Zap, Globe, UserCheck, MessageCircle, Database, ShoppingBag } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Ingredient clarity in seconds",
    description: "No more guessing or searching. Get instant, accurate ingredient analysis.",
    gradient: "from-primary to-green-medium",
  },
  {
    icon: Globe,
    title: "India-first regulatory intelligence",
    description: "Built with India's regulatory landscape in mind, from FSSAI to CDSCO.",
    gradient: "from-soft-blue to-primary",
  },
  {
    icon: UserCheck,
    title: "Personalized safety scoring",
    description: "Tailored analysis based on your specific allergies and sensitivities.",
    gradient: "from-purple to-soft-blue",
  },
  {
    icon: MessageCircle,
    title: "Clean, honest explanations",
    description: "No jargon, no confusion — just clear answers in everyday language.",
    gradient: "from-amber to-primary",
  },
  {
    icon: Database,
    title: "Trustworthy scientific data",
    description: "Backed by peer-reviewed research and verified toxicity databases.",
    gradient: "from-primary to-purple",
  },
  {
    icon: ShoppingBag,
    title: "Built for everyday shoppers",
    description: "Whether you're a parent, health enthusiast, or casual buyer — we've got you.",
    gradient: "from-green-medium to-soft-blue",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
    <section id="why-purelytics" className="py-24 lg:py-32 bg-charcoal relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.05] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-soft-blue/[0.05] rounded-full blur-[120px]" />
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold text-sm mb-6">
            Why Purelytics
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-display-md font-bold text-primary-foreground mb-5 tracking-tight">
            Transparency you can trust
          </h2>
          <p className="text-lg text-primary-foreground/60 max-w-2xl mx-auto leading-relaxed">
            We're building the ingredient transparency platform that consumers deserve.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass-premium rounded-3xl p-7 lg:p-8 h-full transition-all duration-500 hover:bg-primary-foreground/[0.08] group-hover:-translate-y-1">
                {/* Icon with gradient background */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.gradient} p-0.5 mb-6 group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                  <div className="w-full h-full rounded-[14px] bg-charcoal flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-primary-foreground mb-3 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-primary-foreground/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
