import { motion } from "framer-motion";
import { Camera, Search, BookOpen, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Scan",
    description: "Point your camera at any product label. Purelytics instantly extracts the ingredients.",
    color: "primary",
    step: "01",
  },
  {
    icon: Search,
    title: "Decode",
    description: "Every chemical is analyzed, normalized, and matched against scientific toxicity datasets.",
    color: "soft-blue",
    step: "02",
  },
  {
    icon: BookOpen,
    title: "Understand",
    description: "Clear explanations in simple language — what's safe, what's harmful, and why.",
    color: "purple",
    step: "03",
  },
  {
    icon: Sparkles,
    title: "Improve",
    description: "Personalized alerts based on allergies and safer product recommendations.",
    color: "amber",
    step: "04",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-soft-blue/[0.03] rounded-full blur-[100px]" />
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-display-md font-bold text-foreground mb-5 tracking-tight">
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
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+50px)] w-[calc(100%-100px)] h-px bg-gradient-to-r from-border to-transparent" />
              )}

              <div className="relative bg-card rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-primary/30 group-hover:-translate-y-2 overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Step number */}
                <div className="absolute top-6 right-6 text-5xl font-bold text-muted/20 group-hover:text-primary/10 transition-colors duration-500">
                  {step.step}
                </div>

                <div className="relative">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow ${
                    step.color === "primary" ? "bg-primary/10 group-hover:bg-primary/20" : 
                    step.color === "soft-blue" ? "bg-soft-blue/10 group-hover:bg-soft-blue/20" : 
                    step.color === "purple" ? "bg-purple/10 group-hover:bg-purple/20" :
                    "bg-amber/10 group-hover:bg-amber/20"
                  }`}>
                    <step.icon className={`w-8 h-8 ${
                      step.color === "primary" ? "text-primary" : 
                      step.color === "soft-blue" ? "text-soft-blue" : 
                      step.color === "purple" ? "text-purple" :
                      "text-amber"
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
