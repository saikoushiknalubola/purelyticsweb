import { motion } from "framer-motion";
import { ScanLine, Brain, AlertTriangle, ShieldCheck, ArrowRightLeft, Baby, Eye, Lock } from "lucide-react";

const features = [
  { icon: ScanLine, title: "Real-time label scanning", description: "Point, scan, and analyze in milliseconds." },
  { icon: Brain, title: "Smart toxicity scoring", description: "Powered by scientific databases and research." },
  { icon: AlertTriangle, title: "Allergy-aware personalization", description: "Flag ingredients that don't work for you." },
  { icon: ShieldCheck, title: "Safety Badges", description: "Instant visual safety indicators at a glance." },
  { icon: ArrowRightLeft, title: "Safer alternatives", description: "Discover better products that match your needs." },
  { icon: Baby, title: "Parent & baby-safe mode", description: "Extra scrutiny for the littlest consumers." },
  { icon: Eye, title: "Data transparency", description: "See exactly where our data comes from." },
  { icon: Lock, title: "Secure & private", description: "Your data stays yours. Period." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden bg-secondary/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-secondary" />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 bg-background border border-border text-foreground">Features</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-5">Everything you need to shop smarter</h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground">Powerful features designed with simplicity in mind.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.05 }} className="group">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-500 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 bg-background border border-border">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
