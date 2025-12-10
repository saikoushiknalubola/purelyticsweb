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

export function FAQSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <p className="text-primary font-semibold mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Frequently asked questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border/50 rounded-2xl px-6 data-[state=open]:shadow-card transition-shadow duration-300"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
