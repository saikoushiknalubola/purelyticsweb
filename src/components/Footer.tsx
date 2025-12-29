import { Link, useLocation } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Mail, MapPin, Heart } from "lucide-react";

const footerLinks = {
  product: [{ label: "How It Works", href: "/#how-it-works" }, { label: "Features", href: "/#features" }, { label: "Beta Access", href: "/#beta" }],
  company: [{ label: "About Us", href: "/about" }, { label: "Blog", href: "/blog" }],
  legal: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }],
};
const socialLinks = [{ icon: Twitter, href: "https://twitter.com/purelytics", label: "Twitter" }, { icon: Linkedin, href: "https://www.linkedin.com/in/saikoushiknalubola/", label: "LinkedIn" }, { icon: Instagram, href: "https://www.instagram.com/pure_lytics/", label: "Instagram" }];

export function Footer() {
  const location = useLocation();
  const handleHashClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => { if (href.startsWith("/#") && location.pathname === "/") { e.preventDefault(); document.querySelector(href.replace("/", ""))?.scrollIntoView({ behavior: "smooth" }); } };

  return (
    <footer style={{ background: '#0f172a' }} className="text-white">
      <div className="container">
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 md:col-span-4 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#22c55e' }}><span style={{ color: '#0f172a' }} className="font-bold text-xl">P</span></div><span className="font-bold text-2xl">Purelytics</span></Link>
              <p className="mb-6 max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>Empowering consumers with instant ingredient clarity.</p>
              <div className="space-y-3 mb-6">
                <a href="mailto:purelytics@gmail.com" className="flex items-center gap-3 transition-colors hover:text-emerald" style={{ color: 'rgba(255,255,255,0.6)' }}><Mail className="w-4 h-4" /><span className="text-sm">purelytics@gmail.com</span></a>
                <div className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.6)' }}><MapPin className="w-4 h-4" /><span className="text-sm">Warangal, Telangana, India</span></div>
              </div>
              <div className="flex items-center gap-3">{socialLinks.map((s) => (<a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}><s.icon className="w-5 h-5" /></a>))}</div>
            </div>
            <div><h4 className="font-semibold mb-4">Product</h4><ul className="space-y-3">{footerLinks.product.map((l) => (<li key={l.label}><a href={l.href} onClick={(e) => handleHashClick(e, l.href)} className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.label}</a></li>))}</ul></div>
            <div><h4 className="font-semibold mb-4">Company</h4><ul className="space-y-3">{footerLinks.company.map((l) => (<li key={l.label}><Link to={l.href} onClick={() => window.scrollTo(0, 0)} className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.label}</Link></li>))}</ul></div>
            <div><h4 className="font-semibold mb-4">Legal</h4><ul className="space-y-3">{footerLinks.legal.map((l) => (<li key={l.label}><Link to={l.href} onClick={() => window.scrollTo(0, 0)} className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{l.label}</Link></li>))}</ul></div>
          </div>
        </div>
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>© 2025 Purelytics. All rights reserved.</div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Crafted by <a href="https://in.linkedin.com/in/saikoushiknalubola" target="_blank" rel="noopener noreferrer" className="font-semibold transition-colors" style={{ color: '#22c55e' }}>Saikoushik Nalubola</a> with <Heart className="w-3.5 h-3.5" style={{ color: '#22c55e', fill: '#22c55e' }} /> in India</div>
        </div>
      </div>
    </footer>
  );
}
