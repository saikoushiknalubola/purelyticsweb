import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-purelytics", label: "Why Purelytics" },
  { href: "/#features", label: "Features" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const element = document.querySelector(href.replace("/#", "#"));
        if (element) setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const isExternal = (href: string) => href.startsWith("/#");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "backdrop-blur-xl shadow-lg" : ""
      }`}
      style={{ 
        background: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
      }}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: '#22c55e', boxShadow: '0 0 20px -5px rgba(34, 197, 94, 0.5)' }}
          >
            <span className="font-bold text-lg" style={{ color: '#0f172a' }}>P</span>
          </div>
          <span className="font-bold text-xl text-white">Purelytics</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            isExternal(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { if (location.pathname === "/") { e.preventDefault(); handleNavClick(link.href); } }}
                className="px-4 py-2 text-sm font-medium transition-colors duration-300"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium transition-colors duration-300"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a 
            href="/#beta"
            className="inline-flex items-center justify-center h-10 px-6 rounded-full text-sm font-bold transition-all duration-300"
            style={{ 
              background: '#22c55e', 
              color: '#0f172a',
              boxShadow: '0 0 20px -5px rgba(34, 197, 94, 0.5)'
            }}
          >
            Join Beta
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-xl"
            style={{ background: 'rgba(15, 23, 42, 0.98)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                isExternal(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3.5 text-base font-medium rounded-xl transition-colors"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    onClick={(e) => { if (location.pathname === "/") e.preventDefault(); handleNavClick(link.href); }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3.5 text-base font-medium rounded-xl"
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    onClick={() => { setIsMobileMenuOpen(false); window.scrollTo(0, 0); }}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <a 
                href="/#beta"
                className="mt-4 inline-flex items-center justify-center h-12 px-6 rounded-full text-base font-bold"
                style={{ background: '#22c55e', color: '#0f172a' }}
                onClick={(e) => {
                  if (location.pathname === "/") { e.preventDefault(); document.querySelector("#beta")?.scrollIntoView({ behavior: "smooth" }); }
                  setIsMobileMenuOpen(false);
                }}
              >
                Join Beta
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
