import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-mint via-mint to-mint-dark">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px]" />
      </div>
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy/20 text-navy font-medium text-sm mb-8 backdrop-blur-sm border border-navy/10">
            <Sparkles className="w-4 h-4" />Be part of the health revolution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mb-6 tracking-tight">Ready to know what's really in your products?</h2>
          <p className="text-lg text-navy/70 mb-10 max-w-xl mx-auto leading-relaxed">Join the movement for ingredient transparency.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-navy hover:bg-navy-light text-white font-bold h-14 px-8 rounded-full shadow-elevated group" asChild>
              <a href="#beta">Get Early Access<ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" /></a>
            </Button>
            <Button size="lg" className="bg-white/30 hover:bg-white/40 text-navy border border-navy/20 font-semibold h-14 px-8 rounded-full backdrop-blur-sm" asChild>
              <a href="#how-it-works">Learn More</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
