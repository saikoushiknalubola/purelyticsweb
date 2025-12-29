import { motion } from "framer-motion";
import { Zap, Globe, UserCheck, MessageCircle, Database, ShoppingBag } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Ingredient clarity in seconds",
    description: "No more guessing or searching. Get instant, accurate ingredient analysis.",
  },
  {
    icon: Globe,
    title: "India-first regulatory intelligence",
    description: "Built with India's regulatory landscape in mind, from FSSAI to CDSCO.",
  },
  {
    icon: UserCheck,
    title: "Personalized safety scoring",
    description: "Tailored analysis based on your specific allergies and sensitivities.",
  },
  {
    icon: MessageCircle,
    title: "Clean, honest explanations",
    description: "No jargon, no confusion — just clear answers in everyday language.",
  },
  {
    icon: Database,
    title: "Trustworthy scientific data",
    description: "Backed by peer-reviewed research and verified toxicity databases.",
  },
  {
    icon: ShoppingBag,
    title: "Built for everyday shoppers",
    description: "Whether you're a parent, health enthusiast, or casual buyer — we've got you.",
  },
];

export function WhyPurelyticsSection() {
  return (
    <section id="why-purelytics" className="py-24 lg:py-32 bg-navy-light relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mint/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-soft-blue/[0.03] rounded-full blur-[120px]" />
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint font-semibold text-sm mb-6">
            Why Purelytics
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Transparency you can trust
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            We're building the ingredient transparency platform that consumers deserve.
          </p>
        </motion.div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group"
            >
              <div className="glass-card rounded-3xl p-7 lg:p-8 h-full transition-all duration-500 hover:bg-white/[0.08] group-hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-mint/10 flex items-center justify-center mb-6 group-hover:bg-mint/20 group-hover:scale-110 transition-all duration-500">
                  <benefit.icon className="w-7 h-7 text-mint" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                  {benefit.title}
                </h3>
                <p className="text-white/60 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
