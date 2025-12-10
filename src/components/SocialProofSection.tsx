import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

const stats = [
  {
    icon: AlertCircle,
    stat: "87%",
    label: "distrust marketing labels",
    description: "Consumers don't believe what brands claim on packaging.",
  },
  {
    icon: RefreshCw,
    stat: "91%",
    label: "want safer alternatives",
    description: "People actively seek healthier product options.",
  },
  {
    icon: HelpCircle,
    stat: "78%",
    label: "struggle to understand ingredients",
    description: "Complex names and chemicals confuse everyday shoppers.",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-24 lg:py-32 bg-charcoal text-primary-foreground">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-primary font-semibold mb-3">The Problem</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            People want clarity — the data proves it
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Our research shows a massive gap between what consumers want and what they get.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8 text-center hover:bg-primary-foreground/10 transition-colors duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Stat */}
              <p className="text-5xl lg:text-6xl font-bold text-primary mb-2">
                {item.stat}
              </p>
              
              {/* Label */}
              <p className="text-lg font-semibold mb-2">
                {item.label}
              </p>
              
              {/* Description */}
              <p className="text-primary-foreground/60 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
