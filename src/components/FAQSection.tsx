import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Purelytics free?",
    answer: "Yes! Purelytics will be free to use during beta. We're exploring premium features for power users, but the core scanning and analysis will always remain accessible.",
  },
  {
    question: "How accurate is the analysis?",
    answer: "Our ingredient analysis is powered by verified scientific databases and peer-reviewed research. We cross-reference multiple sources and clearly indicate confidence levels for each assessment.",
  },
  {
    question: "What products does it work on?",
    answer: "Purelytics works on any product with an ingredient label — skincare, food, haircare, baby products, cleaning supplies, and more. If it has an ingredient list, we can analyze it.",
  },
  {
    question: "Does it store my data?",
    answer: "We take privacy seriously. Your scans are processed securely and you control your data. We never sell personal information to third parties. Read our full privacy policy for details.",
  },
  {
    question: "Is this medical advice?",
    answer: "No. Purelytics provides educational information about ingredients based on scientific research. It's not a substitute for professional medical advice. Always consult healthcare providers for medical decisions.",
  },
  {
    question: "When will the app be available?",
    answer: "We're currently in closed beta testing. Join our early access list to be among the first to try Purelytics when we launch publicly in early 2025.",
  },
  {
    question: "Can I suggest features or provide feedback?",
    answer: "Absolutely! Beta testers play a crucial role in shaping Purelytics. We actively collect feedback and prioritize features based on user needs. Your input matters.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/[0.02] rounded-full blur-[100px] -translate-y-1/2" />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 lg:mb-16"
          >
            <span className="inline-block text-primary font-semibold mb-4 tracking-wide text-sm uppercase">FAQ</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-[-0.02em]">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Got questions? We've got answers.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border border-border/50 rounded-2xl px-6 data-[state=open]:shadow-card data-[state=open]:border-border transition-all duration-500"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 text-[15px]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}