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
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: 'rgba(34, 197, 94, 0.05)' }} />
      </div>
      
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">Clarity in four simple steps</h2>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>From scanning to understanding — the entire process takes just seconds.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="relative group">
              {index < steps.length - 1 && <div className="hidden lg:block absolute top-14 left-[calc(50%+50px)] w-[calc(100%-100px)] h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />}
              <div className="relative glass-card rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-6 right-6 text-5xl font-bold transition-colors duration-500" style={{ color: 'rgba(255, 255, 255, 0.03)' }}>{step.step}</div>
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                    <step.icon className="w-8 h-8" style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)' }} className="leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
