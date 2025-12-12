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
    title: "Smart toxicity scoring",
    description: "Powered by scientific databases and research.",
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-soft-blue/[0.02] rounded-full blur-[100px]" />
      </div>
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block text-primary font-semibold mb-4 tracking-wide text-sm uppercase">Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-[-0.02em]">
            Everything you need to shop smarter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful features designed with simplicity in mind.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="bg-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 hover:shadow-card transition-all duration-500 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-foreground mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}