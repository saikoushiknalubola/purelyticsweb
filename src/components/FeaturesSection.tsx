import { motion } from "framer-motion";
import { 
  ScanLine, 
  Brain, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRightLeft, 
  Baby, 
  Eye, 
  Lock 
} from "lucide-react";

const features = [
  {
    icon: ScanLine,
    title: "Real-time label scanning",
    description: "Point, scan, and analyze in milliseconds.",
  },
  {
    icon: Brain,
    title: "AI toxicity scoring",
    description: "Powered by machine learning and scientific databases.",
  },
  {
    icon: AlertTriangle,
    title: "Allergy-aware personalization",
    description: "Flag ingredients that don't work for you.",
  },
  {
    icon: ShieldCheck,
    title: "Red/Yellow/Green badges",
    description: "Instant visual safety indicators at a glance.",
  },
  {
    icon: ArrowRightLeft,
    title: "Safer alternatives",
    description: "Discover better products that match your needs.",
  },
  {
    icon: Baby,
    title: "Parent & baby-safe mode",
    description: "Extra scrutiny for the littlest consumers.",
  },
  {
    icon: Eye,
    title: "Data transparency",
    description: "See exactly where our data comes from.",
  },
  {
    icon: Lock,
    title: "Secure & private",
    description: "Your data stays yours. Period.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-background">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="text-primary font-semibold mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything you need to shop smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed with simplicity in mind.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="bg-card rounded-2xl p-5 lg:p-6 border border-border/50 hover:border-primary/20 hover:shadow-card transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-green-light transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
