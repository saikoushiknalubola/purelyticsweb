import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is Purelytics free?",
    answer:
      "Yes! Purelytics will be free to use during beta. We're exploring premium features for power users, but the core scanning and analysis will always remain accessible.",
  },
  {
    question: "How accurate is the analysis?",
    answer:
      "Our ingredient analysis is powered by verified scientific databases and peer-reviewed research. We cross-reference multiple sources and clearly indicate confidence levels for each assessment.",
  },
  {
    question: "What products does it work on?",
    answer:
      "Purelytics works on any product with an ingredient label — skincare, food, haircare, baby products, cleaning supplies, and more. If it has an ingredient list, we can analyze it.",
  },
  {
    question: "Does it store my data?",
    answer:
      "We take privacy seriously. Your scans are processed securely and you control your data. We never sell personal information to third parties. Read our full privacy policy for details.",
  },
  {
    question: "Is this medical advice?",
    answer:
      "No. Purelytics provides educational information about ingredients based on scientific research. It's not a substitute for professional medical advice. Always consult healthcare providers for medical decisions.",
  },
  {
    question: "When will the app be available?",
    answer:
      "We're currently in closed beta testing. Join our early access list to be among the first to try Purelytics when we launch publicly in early 2026.",
  },
  {
    question: "Can I suggest features or provide feedback?",
    answer:
      "Absolutely! Beta testers play a crucial role in shaping Purelytics. We actively collect feedback and prioritize features based on user needs. Your input matters.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 md:w-[400px] md:h-[400px] bg-secondary rounded-full blur-[100px] -translate-y-1/2 opacity-70" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 lg:mb-14"
          >
            <span className="inline-block text-primary font-semibold mb-3 tracking-wide text-xs sm:text-sm uppercase">
              FAQ
            </span>
            <AnimatedHeading className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4">
              Frequently asked questions
            </AnimatedHeading>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Got questions? We've got answers.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-secondary/60 border border-border rounded-2xl px-5 sm:px-6 data-[state=open]:shadow-card transition-all duration-400"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-4 sm:py-5 text-sm sm:text-[15px]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 sm:pb-5 leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
