import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

const stats = [
  { icon: AlertCircle, stat: "87%", label: "distrust marketing labels", description: "Consumers don't believe what brands claim on packaging." },
  { icon: RefreshCw, stat: "91%", label: "want safer alternatives", description: "People actively seek healthier product options." },
  { icon: HelpCircle, stat: "78%", label: "struggle to understand ingredients", description: "Complex names and chemicals confuse everyday shoppers." },
];

export function SocialProofSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-secondary border border-border text-foreground">The Problem</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">People want clarity — the data proves it</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground">Our research shows a massive gap between what consumers want and what they get.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {stats.map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="glass-card rounded-2xl p-7 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5 bg-background border border-border"><item.icon className="w-6 h-6 text-primary" /></div>
              <p className="font-display text-4xl lg:text-5xl mb-2 text-primary">{item.stat}</p>
              <p className="text-base font-semibold text-foreground mb-1">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
