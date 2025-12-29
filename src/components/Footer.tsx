import { Link, useLocation } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail, MapPin, Heart } from "lucide-react";

const footerLinks = {
  product: [{ label: "How It Works", href: "/#how-it-works", isHash: true }, { label: "Features", href: "/#features", isHash: true }, { label: "Beta Access", href: "/#beta", isHash: true }],
  company: [{ label: "About Us", href: "/about", isHash: false }, { label: "Blog", href: "/blog", isHash: false }],
  legal: [{ label: "Privacy Policy", href: "/privacy", isHash: false }, { label: "Terms of Service", href: "/terms", isHash: false }],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/purelytics", label: "Twitter" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/saikoushiknalubola/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/pure_lytics/", label: "Instagram" },
];

export function Footer() {
  const location = useLocation();
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && location.pathname === "/") { e.preventDefault(); const element = document.querySelector(href.replace("/", "")); if (element) element.scrollIntoView({ behavior: "smooth" }); }
  };

  return (
    <footer className="bg-navy text-white">
      <div className="container">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-mint flex items-center justify-center"><span className="text-navy font-bold text-xl">P</span></div>
                <span className="font-bold text-2xl">Purelytics</span>
              </Link>
              <p className="text-white/50 mb-6 max-w-sm leading-relaxed">Empowering consumers with instant ingredient clarity. Scan, decode, and understand what's really in your products.</p>
              <div className="space-y-3 mb-6">
                <a href="mailto:purelytics@gmail.com" className="flex items-center gap-3 text-white/60 hover:text-mint transition-colors"><Mail className="w-4 h-4" /><span className="text-sm">purelytics@gmail.com</span></a>
                <div className="flex items-center gap-3 text-white/60"><MapPin className="w-4 h-4" /><span className="text-sm">Warangal, Telangana, India</span></div>
              </div>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (<a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-mint hover:text-navy transition-all duration-300"><social.icon className="w-5 h-5" /></a>))}
              </div>
            </div>
            <div><h4 className="font-semibold text-white mb-4">Product</h4><ul className="space-y-3">{footerLinks.product.map((link) => (<li key={link.label}><a href={link.href} onClick={(e) => handleHashClick(e, link.href)} className="text-sm text-white/50 hover:text-mint transition-colors">{link.label}</a></li>))}</ul></div>
            <div><h4 className="font-semibold text-white mb-4">Company</h4><ul className="space-y-3">{footerLinks.company.map((link) => (<li key={link.label}><Link to={link.href} onClick={() => window.scrollTo(0, 0)} className="text-sm text-white/50 hover:text-mint transition-colors">{link.label}</Link></li>))}</ul></div>
            <div><h4 className="font-semibold text-white mb-4">Legal</h4><ul className="space-y-3">{footerLinks.legal.map((link) => (<li key={link.label}><Link to={link.href} onClick={() => window.scrollTo(0, 0)} className="text-sm text-white/50 hover:text-mint transition-colors">{link.label}</Link></li>))}</ul></div>
          </div>
        </div>
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/40">© 2025 Purelytics. All rights reserved.</div>
          <div className="flex items-center gap-2 text-sm text-white/50">
            <span>Crafted by</span>
            <a href="https://in.linkedin.com/in/saikoushiknalubola" target="_blank" rel="noopener noreferrer" className="text-mint hover:text-mint-light font-semibold transition-colors">Saikoushik Nalubola</a>
            <span className="flex items-center gap-1">with <Heart className="w-3.5 h-3.5 fill-mint text-mint" /> in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
