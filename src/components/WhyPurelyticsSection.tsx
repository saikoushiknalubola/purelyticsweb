import { motion } from "framer-motion";
import { Zap, Globe, UserCheck, MessageCircle, Database, ShoppingBag } from "lucide-react";

const benefits = [
  { icon: Zap, title: "Ingredient clarity in seconds", description: "No more guessing or searching. Get instant, accurate ingredient analysis." },
  { icon: Globe, title: "India-first regulatory intelligence", description: "Built with India's regulatory landscape in mind, from FSSAI to CDSCO." },
  { icon: UserCheck, title: "Personalized safety scoring", description: "Tailored analysis based on your specific allergies and sensitivities." },
  { icon: MessageCircle, title: "Clean, honest explanations", description: "No jargon, no confusion — just clear answers in everyday language." },
  { icon: Database, title: "Trustworthy scientific data", description: "Backed by peer-reviewed research and verified toxicity databases." },
  { icon: ShoppingBag, title: "Built for everyday shoppers", description: "Whether you're a parent, health enthusiast, or casual buyer — we've got you." },
];

export function WhyPurelyticsSection() {
  return (
    <section id="why-purelytics" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#1e293b' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: 'rgba(34, 197, 94, 0.05)' }} />
      </div>
      
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>Why Purelytics</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">Transparency you can trust</h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>We're building the ingredient transparency platform that consumers deserve.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group">
              <div className="glass-card rounded-3xl p-7 lg:p-8 h-full transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <benefit.icon className="w-7 h-7" style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">{benefit.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)' }} className="leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
