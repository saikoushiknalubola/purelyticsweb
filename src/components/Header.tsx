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
    
    // Handle hash navigation
    if (href.startsWith("/#")) {
      if (location.pathname !== "/") {
        // Navigate to home first, then scroll
        window.location.href = href;
      } else {
        // Already on home, just scroll
        const element = document.querySelector(href.replace("/", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  const isExternal = (href: string) => href.startsWith("/#");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl text-foreground">Purelytics</span>
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
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button variant="default" size="default" asChild>
            <a href="/#beta">Join Beta</a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
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
            className="md:hidden glass border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                isExternal(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
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
                    className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button variant="default" size="lg" className="mt-2" asChild>
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