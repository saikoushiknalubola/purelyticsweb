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
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-[120px] bg-secondary" />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-secondary border border-border text-foreground">
            <span className="w-2 h-2 rounded-full animate-pulse bg-accent" />
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-5">Clarity in four simple steps</h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">From scanning to understanding — the entire process takes just seconds.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative group">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 left-[calc(50%+50px)] w-[calc(100%-100px)] h-px bg-border" />
              )}
              <div className="relative glass-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-6 right-6 text-5xl font-bold" style={{ color: "hsl(var(--primary) / 0.10)" }}>{step.step}</div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 bg-background border border-border">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display text-xl text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
