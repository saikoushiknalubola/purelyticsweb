import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

const stats = [
  { icon: AlertCircle, stat: "87%", label: "distrust marketing labels", description: "Consumers don't believe what brands claim on packaging." },
  { icon: RefreshCw, stat: "91%", label: "want safer alternatives", description: "People actively seek healthier product options." },
  { icon: HelpCircle, stat: "78%", label: "struggle to understand ingredients", description: "Complex names and chemicals confuse everyday shoppers." },
];

export function SocialProofSection() {
  return (
    <section className="py-24 lg:py-32 bg-navy">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint font-semibold text-sm mb-6">The Problem</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">People want clarity — the data proves it</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">Our research shows a massive gap between what consumers want and what they get.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="glass-card rounded-3xl p-8 text-center hover:bg-white/[0.08] transition-colors duration-300">
              <div className="w-14 h-14 rounded-2xl bg-mint/10 flex items-center justify-center mx-auto mb-6"><item.icon className="w-7 h-7 text-mint" /></div>
              <p className="text-5xl lg:text-6xl font-bold text-mint mb-2">{item.stat}</p>
              <p className="text-lg font-semibold text-white mb-2">{item.label}</p>
              <p className="text-white/50 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
