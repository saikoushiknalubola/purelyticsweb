import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Leaf, Shield, Heart, Search, Beaker, Baby, Utensils } from "lucide-react";
import { useState } from "react";

const categories = [
  { label: "All", value: "all" },
  { label: "Ingredient Safety", value: "ingredient-safety" },
  { label: "Product Analysis", value: "product-analysis" },
  { label: "Health Awareness", value: "health-awareness" },
];

const blogPosts = [
  {
    id: "understanding-parabens",
    title: "Understanding Parabens: What You Need to Know",
    excerpt: "Parabens are common preservatives found in cosmetics and skincare products. Learn about their safety profile, potential concerns, and how to identify them on product labels.",
    category: "ingredient-safety",
    categoryLabel: "Ingredient Safety",
    icon: Shield,
    readTime: "5 min read",
    date: "Dec 10, 2025",
    featured: true,
  },
  {
    id: "reading-food-labels",
    title: "How to Read Food Labels Like a Pro",
    excerpt: "Master the art of decoding nutrition labels. Understand hidden sugars, sodium content, and what those E-numbers really mean for your health.",
    category: "product-analysis",
    categoryLabel: "Product Analysis",
    icon: Utensils,
    readTime: "7 min read",
    date: "Dec 8, 2025",
    featured: true,
  },
  {
    id: "baby-safe-products",
    title: "Choosing Safe Products for Your Baby",
    excerpt: "A comprehensive parent's guide to identifying harmful ingredients in baby products and finding safer alternatives for your little one.",
    category: "health-awareness",
    categoryLabel: "Health Awareness",
    icon: Baby,
    readTime: "6 min read",
    date: "Dec 5, 2025",
    featured: true,
  },
  {
    id: "sulfates-in-shampoo",
    title: "Sulfates in Shampoo: Friend or Foe?",
    excerpt: "Discover the truth about sulfates in hair care products. Learn when they're safe and when you might want to avoid them.",
    category: "ingredient-safety",
    categoryLabel: "Ingredient Safety",
    icon: Beaker,
    readTime: "4 min read",
    date: "Dec 3, 2025",
    featured: false,
  },
  {
    id: "natural-vs-synthetic",
    title: "Natural vs Synthetic Ingredients: The Real Difference",
    excerpt: "Not all natural ingredients are safe, and not all synthetic ones are harmful. Learn how to evaluate ingredients objectively.",
    category: "product-analysis",
    categoryLabel: "Product Analysis",
    icon: Leaf,
    readTime: "8 min read",
    date: "Dec 1, 2025",
    featured: false,
  },
  {
    id: "allergen-awareness",
    title: "Common Allergens Hidden in Everyday Products",
    excerpt: "From fragrances to preservatives, discover the most common allergens lurking in your daily products and how to spot them.",
    category: "health-awareness",
    categoryLabel: "Health Awareness",
    icon: Heart,
    readTime: "6 min read",
    date: "Nov 28, 2025",
    featured: false,
  },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Knowledge Hub
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Ingredient Insights &
                <span className="text-primary block mt-2">Health Awareness</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Expert articles on product safety, ingredient analysis, and making informed choices for you and your family.
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b border-border/50">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setActiveCategory(category.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="container">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/blog/${post.id}`} className="block h-full">
                      <div className="h-full bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col">
                        {/* Header with icon */}
                        <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                          <post.icon className="w-14 h-14 text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                          {post.featured && (
                            <span className="absolute top-4 right-4 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4 w-fit">
                            {post.categoryLabel}
                          </span>

                          <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {post.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {post.readTime}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-muted/30 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Stay Informed
              </h2>
              <p className="text-muted-foreground mb-8">
                Join our beta waitlist to get early access and receive the latest articles on ingredient safety directly in your inbox.
              </p>
              <Link
                to="/#beta"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
              >
                Join Beta Waitlist
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
