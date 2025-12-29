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
    <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: '#0f172a' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(34, 197, 94, 0.03)' }} />
      </div>

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6" style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}>Who It's For</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Built for every conscious shopper</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Whether you're a parent, health enthusiast, or just someone who cares — Purelytics is for you.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div key={useCase.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="group">
              <div className="glass-card rounded-3xl p-6 lg:p-8 h-full transition-all duration-500 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <useCase.icon className="w-7 h-7" style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)' }} className="leading-relaxed">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
