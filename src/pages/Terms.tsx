import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function Terms() {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              Last updated: December 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <div className="space-y-8 text-muted-foreground">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="leading-relaxed">
                    By accessing and using Purelytics, you accept and agree to be bound by the terms and 
                    provisions of this agreement. If you do not agree to abide by these terms, please do 
                    not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
                  <p className="leading-relaxed">
                    Purelytics provides an ingredient analysis service that allows users to scan product 
                    labels and receive information about ingredients. Our service is for informational 
                    purposes only and should not be considered medical advice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">3. User Responsibilities</h2>
                  <p className="leading-relaxed">
                    Users are responsible for maintaining the confidentiality of their account information 
                    and for all activities that occur under their account. You agree to notify us immediately 
                    of any unauthorized use of your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">4. Disclaimer</h2>
                  <p className="leading-relaxed">
                    The information provided by Purelytics is for general informational purposes only. 
                    While we strive to provide accurate and up-to-date information, we make no warranties 
                    about the completeness, reliability, or accuracy of this information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
                  <p className="leading-relaxed">
                    Purelytics shall not be liable for any indirect, incidental, special, consequential, 
                    or punitive damages resulting from your use of or inability to use the service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">6. Changes to Terms</h2>
                  <p className="leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of any 
                    changes by posting the new terms on this page with an updated revision date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. Contact Us</h2>
                  <p className="leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{" "}
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