import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-green" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 text-primary-foreground font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Be part of the health revolution
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to know what's really in your products?
          </h2>

          {/* Description */}
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-xl mx-auto">
            Join the movement for ingredient transparency. Be among the first to experience Purelytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated"
              asChild
            >
              <a href="#beta">
                Get Early Access
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button 
              size="xl" 
              className="bg-primary-foreground/20 text-primary-foreground border-2 border-primary-foreground/40 hover:bg-primary-foreground/30 hover:border-primary-foreground/60"
              asChild
            >
              <a href="#how-it-works">
                Learn More
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
