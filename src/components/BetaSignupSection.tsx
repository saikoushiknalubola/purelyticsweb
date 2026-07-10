import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, Rocket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const ALLOWED_CATEGORIES = ["skincare", "food", "baby", "haircare", "cleaning"] as const;

const betaSignupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email must be under 255 characters"),
  age: z
    .string()
    .trim()
    .max(3, "Please enter a valid age")
    .optional()
    .refine(
      (v) => !v || (/^\d+$/.test(v) && Number(v) >= 13 && Number(v) <= 120),
      "Age must be a number between 13 and 120",
    ),
  city: z.string().trim().max(100, "City must be under 100 characters").optional(),
  categories: z
    .array(z.enum(ALLOWED_CATEGORIES))
    .max(ALLOWED_CATEGORIES.length, "Too many categories selected")
    .optional(),
  frustration: z.string().trim().max(1000, "Please keep your response under 1000 characters").optional(),
});

const categories = [
  { id: "skincare", label: "Skincare" },
  { id: "food", label: "Food & Beverages" },
  { id: "baby", label: "Baby Products" },
  { id: "haircare", label: "Haircare" },
  { id: "cleaning", label: "Cleaning Products" },
];

export function BetaSignupSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    categories: [] as string[],
    frustration: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, categoryId] : prev.categories.filter((c) => c !== categoryId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsed = betaSignupSchema.safeParse({
        name: formData.name,
        email: formData.email,
        age: formData.age || undefined,
        city: formData.city || undefined,
        categories: (formData.categories.length > 0 ? formData.categories : undefined) as
          | (typeof ALLOWED_CATEGORIES)[number][]
          | undefined,
        frustration: formData.frustration || undefined,
      });

      if (!parsed.success) {
        toast.error("Please check your details", {
          description: parsed.error.issues[0]?.message ?? "Some fields are invalid.",
        });
        setIsSubmitting(false);
        return;
      }

      const v = parsed.data;
      const { error } = await supabase.from("beta_signups").insert({
        name: v.name,
        email: v.email,
        age: v.age ?? null,
        city: v.city ?? null,
        categories: v.categories && v.categories.length > 0 ? v.categories : null,
        frustration: v.frustration ?? null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("You're already on the list!", {
            description: "This email has already been registered for early access.",
          });
        } else {
          throw error;
        }
      } else {
        toast.success("You're on the list!", {
          description: "We'll be in touch soon with early access details.",
        });

        setFormData({
          name: "",
          email: "",
          age: "",
          city: "",
          categories: [],
          frustration: "",
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error submitting form:", error);
      }
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="beta" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 md:w-[400px] md:h-[400px] bg-secondary rounded-full blur-[100px] opacity-70" />
        <div className="absolute bottom-0 left-0 w-64 h-64 md:w-[350px] md:h-[350px] bg-secondary rounded-full blur-[100px] opacity-60" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-foreground font-medium text-xs sm:text-sm mb-5">
              <Rocket className="w-4 h-4" />
              Limited beta spots available
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground mb-4">
              Join the early access list
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Be among the first to experience ingredient transparency. Help us shape the future of product safety.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-secondary/60 rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-border"
          >
            <div className="space-y-5">
              {/* Name and Email row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11 bg-background border-border focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 bg-background border-border focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Age and City row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Age</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="h-11 bg-background border-border focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <Input
                    type="text"
                    placeholder="Mumbai, Delhi, etc."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-11 bg-background border-border focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2.5">
                  Which categories interest you most?
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition-all duration-300 text-sm ${
                        formData.categories.includes(category.id)
                          ? "bg-primary/10 border-primary/50 text-primary"
                          : "bg-background border-border hover:border-primary/30"
                      }`}
                    >
                      <Checkbox
                        checked={formData.categories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        className="sr-only"
                      />
                      <span className="font-medium">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frustration */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What frustrates you most about ingredient labels?
                </label>
                <Textarea
                  placeholder="Tell us about your experience..."
                  value={formData.frustration}
                  onChange={(e) => setFormData({ ...formData, frustration: e.target.value })}
                  rows={3}
                  className="resize-none bg-background border-border focus:border-primary/50 transition-colors"
                />
              </div>

              {/* Submit button */}
              <Button type="submit" className="w-full h-12 btn-primary group" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Joining..."
                ) : (
                  <>
                    Join the Early Access List
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By joining, you agree to receive updates about Purelytics. We respect your privacy.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
