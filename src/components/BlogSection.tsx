import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, Leaf, Shield, Heart } from "lucide-react";

const blogPosts = [
  {
    id: "understanding-parabens",
    title: "Understanding Parabens: What You Need to Know",
    excerpt: "Parabens are common preservatives found in cosmetics and skincare. Learn about their safety profile and how to identify them on labels.",
    category: "Ingredient Safety",
    icon: Shield,
    readTime: "5 min read",
    date: "Dec 10, 2025",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    id: "reading-food-labels",
    title: "How to Read Food Labels Like a Pro",
    excerpt: "Master the art of decoding nutrition labels. Understand hidden sugars, sodium content, and what those E-numbers really mean.",
    category: "Product Analysis",
    icon: Leaf,
    readTime: "7 min read",
    date: "Dec 8, 2025",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    id: "baby-safe-products",
    title: "Choosing Safe Products for Your Baby",
    excerpt: "A parent's guide to identifying harmful ingredients in baby products and finding safer alternatives for your little one.",
    category: "Health Awareness",
    icon: Heart,
    readTime: "6 min read",
    date: "Dec 5, 2025",
    gradient: "from-secondary/40 to-secondary/10",
  },
];

export function BlogSection() {
  return (
    <section id="blog" className="py-20 lg:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Knowledge Hub
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Learn About
            <span className="text-primary block mt-2">Ingredient Safety</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with expert insights on product ingredients, health tips, and how to make safer choices for you and your family.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="group"
            >
              <Link to={`/blog/${post.id}`} className="block">
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  {/* Header with gradient */}
                  <div className={`h-48 bg-gradient-to-br ${post.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]" />
                    <post.icon className="w-16 h-16 text-foreground/20 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {post.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="text-center mt-12"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card border border-border hover:border-primary/50 text-foreground font-medium transition-all duration-300 hover:shadow-lg"
          >
            View All Articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
