import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#how-it-works", label: "Solution" },
  { href: "/#features", label: "Feature" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
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
        if (element) setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 80);
      }
    } else {
      window.scrollTo(0, 0);
    }
  };

  const isHash = (href: string) => href.startsWith("/#");

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "hsl(var(--background) / 0.88)" : "transparent",
        backdropFilter: isScrolled ? "blur(14px)" : "none",
        borderBottom: isScrolled ? "1px solid hsl(var(--border))" : "1px solid transparent",
      }}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl text-foreground">Purelytics</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            isHash(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => window.scrollTo(0, 0)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="hidden md:block">
          <a href="/#beta" className="inline-flex items-center justify-center h-11 px-6 rounded-full btn-primary">
            Download app
          </a>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-foreground"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              background: "hsl(var(--background) / 0.95)",
              backdropFilter: "blur(14px)",
              borderTop: "1px solid hsl(var(--border))",
            }}
          >
            <div className="container py-5 flex flex-col gap-2">
              {navLinks.map((link) =>
                isHash(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (location.pathname === "/") e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                    className="px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}

              <a
                href="/#beta"
                className="mt-2 inline-flex items-center justify-center h-11 px-6 rounded-full btn-primary"
                onClick={(e) => {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    document.querySelector("#beta")?.scrollIntoView({ behavior: "smooth" });
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                Download app
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
