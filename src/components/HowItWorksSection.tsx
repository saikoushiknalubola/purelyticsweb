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

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-background">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-primary font-semibold mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Clarity in four simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From scanning to understanding — the entire process takes just seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-border" />
              )}

              <div className="relative bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50">
                {/* Step number */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
                  step.color === "primary" ? "bg-green-light" : 
                  step.color === "soft-blue" ? "bg-soft-blue/10" : 
                  "bg-amber/10"
                }`}>
                  <step.icon className={`w-7 h-7 ${
                    step.color === "primary" ? "text-primary" : 
                    step.color === "soft-blue" ? "text-soft-blue" : 
                    "text-amber"
                  }`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
