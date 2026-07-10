import { AlertTriangle, FlaskConical, Leaf, ShieldAlert, ShieldCheck, Beaker } from "lucide-react";

const facts = [
  { icon: AlertTriangle, text: "1 in 5 spice samples in South Asia test positive for adulteration — from brick dust in chili to lead chromate in turmeric." },
  { icon: FlaskConical, text: "‘Natural flavor’ can legally hide 100+ chemicals — including solvents you'd never eat on their own." },
  { icon: ShieldAlert, text: "Palm oil is relabeled under 30+ names — ‘vegetable oil’, ‘glyceryl stearate’, ‘sodium palmate’ and more." },
  { icon: Beaker, text: "Milk in bulk supply chains is routinely diluted, then ‘corrected’ with urea, detergent, or synthetic fat." },
  { icon: Leaf, text: "‘Organic’ on the front doesn't mean organic inside — only certified seals with a valid ID number are enforceable." },
  { icon: ShieldCheck, text: "Titanium dioxide, banned as a food additive in the EU since 2022, still appears in candies and coatings sold elsewhere." },
  { icon: AlertTriangle, text: "Honey is the third-most faked food on earth — most ‘pure honey’ jars are cut with rice or corn syrup." },
  { icon: FlaskConical, text: "‘No added sugar’ can still mean glucose syrup, maltodextrin, fruit juice concentrate — all sugar, differently spelled." },
];

function Row({ reverse = false }: { reverse?: boolean }) {
  return (
    <div
      className="flex gap-4 shrink-0 animate-[marquee_60s_linear_infinite] hover:[animation-play-state:paused]"
      style={reverse ? { animationDirection: "reverse" } : undefined}
      aria-hidden="true"
    >
      {[...facts, ...facts].map((f, i) => (
        <div
          key={i}
          className="flex items-start gap-3 min-w-[320px] max-w-[380px] rounded-2xl border border-border/60 bg-card/70 backdrop-blur px-5 py-4 shadow-sm"
        >
          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <f.icon className="h-4 w-4" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">{f.text}</p>
        </div>
      ))}
    </div>
  );
}

export function IngredientFactsMarquee() {
  return (
    <section className="py-16 lg:py-24 bg-secondary/40 border-y border-border/60 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-semibold uppercase tracking-[0.18em] mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> The truth on the label
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight text-primary">
            What's really in the things you eat, drink, and put on your skin.
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/75 leading-relaxed">
            Purelytics decodes fine print, exposes adulterants, and shows the risk in one glance — so you never have to trust marketing again.
          </p>
        </div>

        {/* Facts marquee — two directions */}
        <div
          className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
          role="region"
          aria-label="Facts about food and ingredient adulteration"
        >
          <div className="flex gap-4 overflow-hidden">
            <Row />
            <Row />
          </div>
          <div className="flex gap-4 overflow-hidden">
            <Row reverse />
            <Row reverse />
          </div>
        </div>

      </div>
    </section>
  );
}