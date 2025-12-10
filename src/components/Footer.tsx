import { Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "mailto:hello@purelytics.com" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@purelytics.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-primary-foreground">
      <div className="container py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Logo and tagline */}
          <div className="text-center lg:text-left">
            <a href="#" className="flex items-center gap-2 justify-center lg:justify-start mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl">Purelytics</span>
            </a>
            <p className="text-primary-foreground/60 text-sm">
              Ingredient clarity for everyone.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/50">
            © 2025 Purelytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
