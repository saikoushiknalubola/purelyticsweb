import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const sectionId = href.replace("/#", "#");
        const element = document.querySelector(sectionId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const isExternal = (href: string) => href.startsWith("/#");
  const isOnDarkHero = location.pathname === "/" && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl shadow-soft border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className={`font-bold text-xl transition-colors duration-300 ${
            isOnDarkHero ? "text-primary-foreground" : "text-foreground"
          }`}>
            Purelytics
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            isExternal(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-primary/10 ${
                  isOnDarkHero 
                    ? "text-primary-foreground/70 hover:text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-primary/10 ${
                  isOnDarkHero 
                    ? "text-primary-foreground/70 hover:text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button 
            className={`rounded-xl font-semibold transition-all duration-300 ${
              isOnDarkHero 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
            asChild
          >
            <a href="/#beta">Join Beta</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isOnDarkHero ? "text-primary-foreground" : "text-foreground"
          }`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
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
            className="md:hidden bg-charcoal/98 backdrop-blur-xl border-t border-primary-foreground/10"
          >
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                isExternal(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3.5 text-base font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors rounded-xl hover:bg-primary-foreground/5"
                    onClick={(e) => {
                      if (location.pathname === "/") {
                        e.preventDefault();
                      }
                      handleNavClick(link.href);
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="px-4 py-3.5 text-base font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors rounded-xl hover:bg-primary-foreground/5"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button 
                size="lg" 
                className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-glow" 
                asChild
              >
                <a 
                  href="/#beta" 
                  onClick={(e) => {
                    if (location.pathname === "/") {
                      e.preventDefault();
                      const element = document.querySelector("#beta");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Join Beta
                </a>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
