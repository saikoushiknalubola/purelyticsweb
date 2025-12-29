import { motion } from "framer-motion";
import { Baby, Utensils, Droplets, SprayCan, Heart, Leaf } from "lucide-react";

const useCases = [
  { icon: Droplets, title: "Skincare Lovers", description: "Decode serums, moisturizers & sunscreens. Know exactly what touches your skin." },
  { icon: Utensils, title: "Health-Conscious Eaters", description: "Scan packaged foods to spot hidden sugars, preservatives & allergens." },
  { icon: Baby, title: "Parents & Caregivers", description: "Extra scrutiny for baby products. Protect the ones who can't protect themselves." },
  { icon: SprayCan, title: "Home & Cleaning", description: "Understand what chemicals you're bringing into your living spaces." },
  { icon: Heart, title: "Allergy Sufferers", description: "Personalized alerts for ingredients that affect you specifically." },
  { icon: Leaf, title: "Eco-Conscious Shoppers", description: "Identify harmful environmental ingredients and choose sustainable options." },
];

export function UseCasesSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-1/3 w-80 h-80 rounded-full blur-[110px] bg-secondary opacity-60" />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 bg-secondary border border-border text-foreground">Who It's For</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">Built for every conscious shopper</h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-muted-foreground">Whether you're a parent, health enthusiast, or just someone who cares — Purelytics is for you.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((useCase, index) => (
            <motion.div key={useCase.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.06 }} className="group">
              <div className="glass-card rounded-2xl p-6 h-full transition-all duration-400 hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-background border border-border transition-transform duration-300 group-hover:scale-110">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
