import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 lg:pb-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-primary font-semibold mb-3">Legal</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: December 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Information We Collect</h2>
                  <p className="leading-relaxed">
                    At Purelytics, we collect information you provide directly to us, such as when you create an account, 
                    use our scanning features, or contact us for support. This may include your name, email address, 
                    and product scanning history.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
                  <p className="leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, 
                    to personalize your experience, and to communicate with you about products, services, 
                    and promotional offers.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. Data Security</h2>
                  <p className="leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction. 
                    Your data is encrypted both in transit and at rest.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Data Sharing</h2>
                  <p className="leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this policy or as required by law.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Your Rights</h2>
                  <p className="leading-relaxed">
                    You have the right to access, correct, or delete your personal information at any time. 
                    You can also opt out of marketing communications by following the unsubscribe link in our emails.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Contact Us</h2>
                  <p className="leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at{" "}
                    <a href="mailto:purelytics@gmail.com" className="text-primary hover:underline">
                      purelytics@gmail.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}