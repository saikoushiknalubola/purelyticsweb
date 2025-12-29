import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

const stats = [
  { icon: AlertCircle, stat: "87%", label: "distrust marketing labels", description: "Consumers don't believe what brands claim on packaging." },
  { icon: RefreshCw, stat: "91%", label: "want safer alternatives", description: "People actively seek healthier product options." },
  { icon: HelpCircle, stat: "78%", label: "struggle to understand ingredients", description: "Complex names and chemicals confuse everyday shoppers." },
];

export function SocialProofSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: '#0f172a' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>The Problem</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">People want clarity — the data proves it</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Our research shows a massive gap between what consumers want and what they get.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item, index) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="glass-card rounded-3xl p-8 text-center transition-colors duration-300">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)' }}><item.icon className="w-7 h-7" style={{ color: '#22c55e' }} /></div>
              <p className="text-5xl lg:text-6xl font-bold mb-2" style={{ color: '#22c55e' }}>{item.stat}</p>
              <p className="text-lg font-semibold text-white mb-2">{item.label}</p>
              <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
