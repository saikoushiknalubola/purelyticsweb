import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";

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
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((c) => c !== categoryId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

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
    setIsSubmitting(false);
  };

  return (
    <section id="beta" className="py-24 lg:py-32 bg-secondary/30">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Limited beta spots available
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Join the early access list
            </h2>
            <p className="text-lg text-muted-foreground">
              Be among the first to experience ingredient transparency. Help us shape
              the future of product safety.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card border border-border/50"
          >
            <div className="space-y-6">
              {/* Name and Email row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              {/* Age and City row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age
                  </label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City
                  </label>
                  <Input
                    type="text"
                    placeholder="Mumbai, Delhi, etc."
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Which categories interest you most?
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                        formData.categories.includes(category.id)
                          ? "bg-primary/10 border-primary text-primary"
                          : "bg-secondary border-border hover:border-primary/50"
                      }`}
                    >
                      <Checkbox
                        checked={formData.categories.includes(category.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(category.id, checked as boolean)
                        }
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{category.label}</span>
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
                  rows={4}
                  className="resize-none"
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Joining..."
                ) : (
                  <>
                    Join the Early Access List
                    <ArrowRight className="ml-2 w-5 h-5" />
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
