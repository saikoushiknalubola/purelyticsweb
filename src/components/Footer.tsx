import { Link, useLocation } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

const footerLinks = {
  quick: [
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact us", href: "/#beta" },
  ],
  resources: [
    { label: "Blog", href: "/blog" },
    { label: "Help center", href: "/#faq" },
    { label: "Support", href: "/#beta" },
  ],
  solution: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "Features", href: "/#features" },
    { label: "Why Purelytics", href: "/#why-purelytics" },
  ],
  about: [
    { label: "Company", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/purelytics", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/saikoushiknalubola/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/pure_lytics/", label: "Instagram" },
];

export function Footer() {
  const location = useLocation();

  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="panel-olive">
      <div className="container">
        <div className="py-14 lg:py-16">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Brand */}
            <div className="lg:col-span-4">
              <Link to="/" className="inline-flex items-center gap-2">
                <span className="font-display text-3xl">Ply<span className="text-accent">.</span></span>
              </Link>
              <p className="mt-4 max-w-sm leading-relaxed" style={{ color: "hsl(var(--primary-foreground) / 0.75)" }}>
                Empowering consumers with instant ingredient clarity.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="mailto:purelytics@gmail.com"
                  className="flex items-center gap-3 text-sm transition-colors"
                  style={{ color: "hsl(var(--primary-foreground) / 0.78)" }}
                >
                  <Mail className="w-4 h-4" /> purelytics@gmail.com
                </a>
                <div className="flex items-center gap-3 text-sm" style={{ color: "hsl(var(--primary-foreground) / 0.78)" }}>
                  <MapPin className="w-4 h-4" /> Warangal, Telangana, India
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: "hsl(var(--primary-foreground) / 0.08)", color: "hsl(var(--primary-foreground) / 0.85)" }}
                  >
                    <s.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Columns */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Quick Link</h4>
                <ul className="space-y-3">
                  {footerLinks.quick.map((l) => (
                    <li key={l.label}>
                      {l.href.startsWith("/#") ? (
                        <a
                          href={l.href}
                          onClick={(e) => handleHashClick(e, l.href)}
                          className="text-sm"
                          style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.href}
                          onClick={() => window.scrollTo(0, 0)}
                          className="text-sm"
                          style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-3">
                  {footerLinks.resources.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => handleHashClick(e, l.href)}
                        className="text-sm"
                        style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Solution</h4>
                <ul className="space-y-3">
                  {footerLinks.solution.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        onClick={(e) => handleHashClick(e, l.href)}
                        className="text-sm"
                        style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">About Us</h4>
                <ul className="space-y-3">
                  {footerLinks.about.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.href}
                        onClick={() => window.scrollTo(0, 0)}
                        className="text-sm"
                        style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h4 className="font-display text-2xl mb-4">Newsletter-sign up</h4>
              <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--primary-foreground) / 0.72)" }}>
                Subscribe to our newsletter to receive updates on ingredient safety and product transparency.
              </p>

              <form className="mt-5 flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="h-12 w-full rounded-2xl px-4 bg-background/10 border border-white/15 text-primary-foreground placeholder:text-primary-foreground/50 outline-none"
                />
                <button type="submit" className="h-12 px-5 rounded-2xl bg-accent text-accent-foreground font-semibold">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="py-8 border-t" style={{ borderColor: "hsl(var(--primary-foreground) / 0.14)" }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm" style={{ color: "hsl(var(--primary-foreground) / 0.6)" }}>
              © {new Date().getFullYear()} Purelytics. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm" style={{ color: "hsl(var(--primary-foreground) / 0.6)" }}>
              <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms" className="hover:underline">Terms & Condition</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
