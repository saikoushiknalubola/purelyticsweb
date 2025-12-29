import { motion } from "framer-motion";
import { Baby, Utensils, Droplets, SprayCan, Heart, Leaf } from "lucide-react";

const useCases = [
  {
    icon: Droplets,
    title: "Skincare Lovers",
    description: "Decode serums, moisturizers & sunscreens. Know exactly what touches your skin.",
  },
  {
    icon: Utensils,
    title: "Health-Conscious Eaters",
    description: "Scan packaged foods to spot hidden sugars, preservatives & allergens.",
  },
  {
    icon: Baby,
    title: "Parents & Caregivers",
    description: "Extra scrutiny for baby products. Protect the ones who can't protect themselves.",
  },
  {
    icon: SprayCan,
    title: "Home & Cleaning",
    description: "Understand what chemicals you're bringing into your living spaces.",
  },
  {
    icon: Heart,
    title: "Allergy Sufferers",
    description: "Personalized alerts for ingredients that affect you specifically.",
  },
  {
    icon: Leaf,
    title: "Eco-Conscious Shoppers",
    description: "Identify harmful environmental ingredients and choose sustainable options.",
  },
];

export function UseCasesSection() {
  return (
    <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-mint/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-soft-blue/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint font-semibold text-sm mb-6">
            Who It's For
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            Built for every conscious shopper
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Whether you're a parent, health enthusiast, or just someone who cares — Purelytics is for you.
          </p>
        </motion.div>

        {/* Use cases grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <div className="glass-card rounded-3xl p-6 lg:p-8 h-full transition-all duration-500 hover:bg-white/[0.08] group-hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-mint/10 flex items-center justify-center mb-5 group-hover:bg-mint/20 group-hover:scale-110 transition-all duration-500">
                  <useCase.icon className="w-7 h-7 text-mint" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
