import { motion } from "framer-motion";
import { Camera, Search, BookOpen, Sparkles } from "lucide-react";

const steps = [
  { icon: Camera, title: "Scan", description: "Point your camera at any product label. Purelytics instantly extracts the ingredients.", step: "01" },
  { icon: Search, title: "Decode", description: "Every chemical is analyzed, normalized, and matched against scientific toxicity datasets.", step: "02" },
  { icon: BookOpen, title: "Understand", description: "Clear explanations in simple language — what's safe, what's harmful, and why.", step: "03" },
  { icon: Sparkles, title: "Improve", description: "Personalized alerts based on allergies and safer product recommendations.", step: "04" },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 relative overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] bg-secondary opacity-70" />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-secondary border border-border text-foreground">
            <span className="w-2 h-2 rounded-full animate-pulse bg-accent" />
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">Clarity in four simple steps</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">From scanning to understanding — the entire process takes just seconds.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
              )}
              <div className="relative glass-card rounded-2xl p-6 transition-all duration-400 hover:-translate-y-1 overflow-hidden h-full">
                <div className="absolute top-4 right-4 text-4xl font-bold text-primary/10">{step.step}</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-background border border-border transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
