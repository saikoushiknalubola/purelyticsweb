import { Link, useLocation } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail, MapPin, Heart } from "lucide-react";

const footerLinks = {
  product: [
    { label: "How It Works", href: "/#how-it-works", isHash: true },
    { label: "Features", href: "/#features", isHash: true },
    { label: "Beta Access", href: "/#beta", isHash: true },
  ],
  company: [
    { label: "About Us", href: "/about", isHash: false },
    { label: "Blog", href: "/blog", isHash: false },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy", isHash: false },
    { label: "Terms of Service", href: "/terms", isHash: false },
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
      const element = document.querySelector(href.replace("/", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container">
        {/* Main footer content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">P</span>
                </div>
                <span className="font-bold text-2xl">Purelytics</span>
              </Link>
              <p className="text-primary-foreground/60 mb-6 max-w-sm leading-relaxed">
                Empowering consumers with instant ingredient clarity. Scan, decode, and understand what's really in your products.
              </p>

              {/* Contact info */}
              <div className="space-y-3 mb-6">
                <a 
                  href="mailto:purelytics@gmail.com" 
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">purelytics@gmail.com</span>
                </a>
                <div className="flex items-center gap-3 text-primary-foreground/70">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Warangal, Telangana, India</span>
                </div>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product links */}
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleHashClick(e, link.href)}
                      className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company links */}
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h4 className="font-semibold text-primary-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-sm text-primary-foreground/60 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Made in Bharat Section */}
        <div className="py-12 lg:py-16 border-t border-primary-foreground/10">
          <div className="flex flex-col items-center gap-8">
            {/* Premium Made in India Badge */}
            <div className="relative w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-transparent to-green-600/20 blur-2xl opacity-50" />
              
              <div className="relative flex flex-col sm:flex-row items-center gap-5 px-6 sm:px-8 py-6 rounded-3xl bg-gradient-to-br from-primary-foreground/[0.03] to-primary-foreground/[0.08] border border-primary-foreground/10 backdrop-blur-sm">
                {/* Indian Flag - Vertical on mobile, horizontal on desktop */}
                <div className="flex sm:flex-col gap-1 shrink-0">
                  <div className="w-10 h-3 sm:w-10 sm:h-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 shadow-sm shadow-orange-500/30" />
                  <div className="w-10 h-3 sm:w-10 sm:h-2.5 rounded-full bg-gradient-to-r from-gray-100 to-white shadow-sm" />
                  <div className="w-10 h-3 sm:w-10 sm:h-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm shadow-green-500/30" />
                </div>
                
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1">
                  <span className="text-xl sm:text-2xl font-bold text-primary-foreground tracking-tight">
                    Made in Bharat
                  </span>
                  <span className="text-sm text-primary-foreground/50 flex items-center gap-1.5 mt-1">
                    Crafted with <Heart className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" /> in Warangal
                  </span>
                </div>

                {/* Ashoka Chakra */}
                <div className="hidden sm:flex w-12 h-12 rounded-full border-2 border-blue-500/60 items-center justify-center bg-blue-500/5 shrink-0">
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-blue-500/40 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm text-primary-foreground/40 text-center max-w-sm leading-relaxed">
              Empowering Indian consumers with transparency and trust in every product
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-primary-foreground/50 font-medium tracking-wide">
              © 2025 Purelytics. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
              <span className="text-sm text-primary-foreground/60 font-medium">
                Crafted by{" "}
                <a 
                  href="https://in.linkedin.com/in/saikoushiknalubola" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors duration-300 hover:underline underline-offset-2"
                >
                  Saikoushik Nalubola
                </a>
              </span>
              <span className="hidden md:inline text-primary-foreground/20">|</span>
              <span className="text-sm text-primary-foreground/50 italic">
                Advancing health technology across India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}