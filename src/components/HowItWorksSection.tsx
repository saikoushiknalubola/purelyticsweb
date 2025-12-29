import { motion } from "framer-motion";
import { Camera, Search, BookOpen, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Scan",
    description: "Point your camera at any product label. Purelytics instantly extracts the ingredients.",
    step: "01",
  },
  {
    icon: Search,
    title: "Decode",
    description: "Every chemical is analyzed, normalized, and matched against scientific toxicity datasets.",
    step: "02",
  },
  {
    icon: BookOpen,
    title: "Understand",
    description: "Clear explanations in simple language — what's safe, what's harmful, and why.",
    step: "03",
  },
  {
    icon: Sparkles,
    title: "Improve",
    description: "Personalized alerts based on allergies and safer product recommendations.",
    step: "04",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-mint/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-soft-blue/[0.02] rounded-full blur-[120px]" />
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint font-semibold text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Clarity in four simple steps
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            From scanning to understanding — the entire process takes just seconds.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(50%+50px)] w-[calc(100%-100px)] h-px bg-gradient-to-r from-white/10 to-transparent" />
              )}

              <div className="relative glass-card rounded-3xl p-8 transition-all duration-500 hover:bg-white/[0.08] group-hover:-translate-y-2 overflow-hidden">
                {/* Step number */}
                <div className="absolute top-6 right-6 text-5xl font-bold text-white/5 group-hover:text-mint/10 transition-colors duration-500">
                  {step.step}
                </div>

                <div className="relative">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-mint/10 flex items-center justify-center mb-6 group-hover:bg-mint/20 group-hover:scale-110 transition-all duration-500">
                    <step.icon className="w-8 h-8 text-mint" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
