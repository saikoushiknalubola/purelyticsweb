import { motion } from "framer-motion";
import { Camera, Search, BookOpen, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Scan",
    description: "Point your camera at any product label. Purelytics instantly extracts the ingredients.",
    color: "primary",
  },
  {
    icon: Search,
    title: "Decode",
    description: "Every chemical is analyzed, normalized, and matched against scientific toxicity datasets.",
    color: "soft-blue",
  },
  {
    icon: BookOpen,
    title: "Understand",
    description: "Clear explanations in simple language — what's safe, what's harmful, and why.",
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "Improve",
    description: "Personalized alerts based on allergies and safer product recommendations.",
    color: "amber",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '48px 48px'
      }} />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block text-primary font-semibold mb-4 tracking-wide text-sm uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-[-0.02em]">
            Clarity in four simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From scanning to understanding — the entire process takes just seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative bg-card rounded-2xl p-7 shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-border group-hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground border border-border/50">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 ${
                  step.color === "primary" ? "bg-gradient-to-br from-primary/20 to-primary/5" : 
                  step.color === "soft-blue" ? "bg-gradient-to-br from-soft-blue/20 to-soft-blue/5" : 
                  "bg-gradient-to-br from-amber/20 to-amber/5"
                }`}>
                  <step.icon className={`w-7 h-7 ${
                    step.color === "primary" ? "text-primary" : 
                    step.color === "soft-blue" ? "text-soft-blue" : 
                    "text-amber"
                  }`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2.5">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}