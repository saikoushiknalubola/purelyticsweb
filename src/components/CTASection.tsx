import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden panel-olive">
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-3xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-background/12 border border-white/12">
            <Sparkles className="w-4 h-4" />Be part of the transparency movement
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5">Ready to know what's really in your products?</h2>
          <p className="text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed" style={{ color: "hsl(var(--primary-foreground) / 0.78)" }}>Join the early access list and help shape Purelytics.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/beta"
              onClick={() => window.scrollTo(0, 0)}
              className="inline-flex items-center justify-center gap-2 h-13 px-8 rounded-full text-base font-bold transition-all group bg-accent text-accent-foreground"
            >
              Get Early Access<ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center h-13 px-8 rounded-full text-base font-semibold bg-background/10 border border-white/18" style={{ color: "hsl(var(--primary-foreground))" }}>Learn More</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
