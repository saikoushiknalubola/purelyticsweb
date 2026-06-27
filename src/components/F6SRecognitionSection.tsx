import { motion } from "framer-motion";
import f6sAsset from "@/assets/f6s-top-company.png.asset.json";

export function F6SRecognitionSection() {
  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground text-center mb-6">
            Recognition
          </p>
          <a
            href="https://www.f6s.com/purelytics"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Purelytics ranked #1 Top Company on F6S — Companies and Startups, June 2026"
            className="group block rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-0.5"
          >
            <motion.img
              src={f6sAsset.url}
              alt="F6S #1 Top Company — Companies and Startups, June 2026"
              loading="lazy"
              className="w-full h-auto"
              initial={{ scale: 0.98, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </a>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Purelytics was ranked <span className="text-foreground font-semibold">#1 Top Company</span> in Companies and Startups by F6S, June 2026.
          </p>
        </motion.div>
      </div>
    </section>
  );
}