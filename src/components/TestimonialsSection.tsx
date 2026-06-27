import { motion } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { Star, Quote, User } from "lucide-react";

const testimonials = [
  {
    quote:
      "I used to spend hours researching ingredients online. Now I just scan and get clear answers. It's become my go-to before buying any skincare.",
    author: "Vennela",
    role: "Skincare Enthusiast",
    location: "Warangal",
    rating: 5,
  },
  {
    quote:
      "As someone with sensitive skin, knowing exactly what's in my products has been life-changing. I trust Purelytics completely.",
    author: "Saanve",
    role: "Early Tester",
    location: "Warangal",
    rating: 5,
  },
  {
    quote:
      "The ingredient breakdown is so easy to understand. I finally know which products are actually safe for daily use.",
    author: "Ashrad",
    role: "Beta User",
    location: "Hyderabad",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/40">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="inline-block text-primary font-semibold mb-3 tracking-wide text-xs sm:text-sm uppercase">
            Early Feedback
          </span>
          <AnimatedHeading className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4">
            What our beta testers say
          </AnimatedHeading>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real users who tried Purelytics early.
          </p>
        </motion.div>

        {/* Testimonials grid - mobile: stack, md: 3 cols */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative bg-secondary/70 rounded-2xl p-5 sm:p-6 border border-border"
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Quote className="w-4 h-4 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground leading-relaxed mb-5 text-sm sm:text-base italic">
                "{testimonial.quote}"
              </p>

              {/* Author - no image, just icon */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.role} · {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
