import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm" style={{ background: 'rgba(15, 23, 42, 0.2)', color: '#0f172a', border: '1px solid rgba(15, 23, 42, 0.1)' }}>
            <Sparkles className="w-4 h-4" />Be part of the health revolution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-tight" style={{ color: '#0f172a' }}>Ready to know what's really in your products?</h2>
          <p className="text-lg mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(15, 23, 42, 0.7)' }}>Join the movement for ingredient transparency.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#beta" className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full text-base font-bold transition-all group" style={{ background: '#0f172a', color: 'white', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)' }}>
              Get Early Access<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center h-14 px-8 rounded-full text-base font-semibold backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.3)', color: '#0f172a', border: '1px solid rgba(15, 23, 42, 0.2)' }}>Learn More</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
