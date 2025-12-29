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
    <section id="why-purelytics" className="py-20 lg:py-28 relative overflow-hidden bg-secondary/40">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[140px] bg-secondary opacity-60" />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-background border border-border text-foreground">Why Purelytics</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">Transparency you can trust</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">We're building the ingredient transparency platform that consumers deserve.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <motion.div key={benefit.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-400 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-background border border-border transition-transform duration-300 group-hover:scale-110">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-base text-foreground mb-2 leading-snug">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
