import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Share2, Leaf, Shield, Heart, Beaker, Baby, Utensils } from "lucide-react";

// Blog post data with full content
const blogPostsData: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  icon: React.ElementType;
  readTime: string;
  date: string;
  content: string[];
  relatedPosts: string[];
}> = {
  "understanding-parabens": {
    title: "Understanding Parabens: What You Need to Know",
    excerpt: "Parabens are common preservatives found in cosmetics and skincare products. Learn about their safety profile, potential concerns, and how to identify them on product labels.",
    category: "ingredient-safety",
    categoryLabel: "Ingredient Safety",
    icon: Shield,
    readTime: "5 min read",
    date: "Dec 10, 2025",
    content: [
      "Parabens have been used as preservatives in cosmetics and personal care products since the 1920s. They prevent the growth of harmful bacteria and mold, extending the shelf life of products we use daily.",
      "The most common parabens you'll find on ingredient labels include methylparaben, ethylparaben, propylparaben, and butylparaben. These are often listed near the end of ingredient lists, as preservatives are typically used in small concentrations.",
      "## Why the Controversy?",
      "In the early 2000s, a study detected parabens in breast tumor tissue, sparking widespread concern. However, it's important to note that this study did not prove parabens cause cancer – it simply showed they were present. Since then, numerous scientific reviews have found no conclusive evidence linking parabens to cancer when used in cosmetics at approved concentrations.",
      "## What Regulators Say",
      "Both the FDA (U.S. Food and Drug Administration) and the European Commission's Scientific Committee on Consumer Safety have reviewed paraben safety extensively. They've concluded that parabens are safe for use in cosmetics at concentrations up to 0.4% for individual parabens and 0.8% for mixtures.",
      "## How to Identify Parabens",
      "Look for ingredients ending in '-paraben' on your product labels. Common examples include: Methylparaben, Propylparaben, Butylparaben, Ethylparaben, and Isobutylparaben.",
      "## Making Informed Choices",
      "If you prefer to avoid parabens, look for products labeled 'paraben-free.' However, remember that alternatives must still preserve the product effectively. Some natural preservatives may be less effective or cause other sensitivities.",
      "At Purelytics, we help you scan and understand these ingredients instantly, giving you the power to make choices aligned with your personal preferences and health needs."
    ],
    relatedPosts: ["sulfates-in-shampoo", "natural-vs-synthetic", "allergen-awareness"]
  },
  "reading-food-labels": {
    title: "How to Read Food Labels Like a Pro",
    excerpt: "Master the art of decoding nutrition labels. Understand hidden sugars, sodium content, and what those E-numbers really mean for your health.",
    category: "product-analysis",
    categoryLabel: "Product Analysis",
    icon: Utensils,
    readTime: "7 min read",
    date: "Dec 8, 2025",
    content: [
      "Reading food labels can feel overwhelming with all the numbers, percentages, and unfamiliar terms. But understanding these labels is crucial for making informed dietary choices. Let's break it down step by step.",
      "## Start with Serving Size",
      "The first thing to check is the serving size at the top of the nutrition label. All the nutritional information listed is based on this amount. A package might contain multiple servings, so if you eat the whole thing, you'll need to multiply accordingly.",
      "## Understanding Daily Values (%DV)",
      "The %DV tells you how much of a nutrient one serving contributes to your daily diet, based on a 2,000-calorie diet. As a general guide: 5% DV or less is considered low, while 20% DV or more is considered high.",
      "## Hidden Sugars",
      "Sugar goes by many names on ingredient lists. Watch for: corn syrup, high-fructose corn syrup, dextrose, maltose, sucrose, fruit juice concentrate, and honey. The new labels now distinguish between 'Total Sugars' and 'Added Sugars' – focus on keeping added sugars low.",
      "## Decoding E-Numbers",
      "In India and internationally, you'll often see additives listed as E-numbers. Not all E-numbers are harmful – for example, E300 is simply vitamin C (ascorbic acid). However, some people prefer to avoid certain additives like artificial colors (E102-E180) or some preservatives.",
      "## The Ingredient List Trick",
      "Ingredients are listed in descending order by weight. If sugar, salt, or an unfamiliar additive appears in the first few ingredients, the product contains a significant amount of it.",
      "## What to Prioritize",
      "Focus on: fiber (aim high), sodium (keep low, under 2,300mg daily), protein (adequate for your needs), and added sugars (limit to 25-36g daily). Pay less attention to total fat unless managing specific health conditions.",
      "With Purelytics, scanning any food label gives you instant clarity on what's healthy and what to watch out for."
    ],
    relatedPosts: ["natural-vs-synthetic", "allergen-awareness", "understanding-parabens"]
  },
  "baby-safe-products": {
    title: "Choosing Safe Products for Your Baby",
    excerpt: "A comprehensive parent's guide to identifying harmful ingredients in baby products and finding safer alternatives for your little one.",
    category: "health-awareness",
    categoryLabel: "Health Awareness",
    icon: Baby,
    readTime: "6 min read",
    date: "Dec 5, 2025",
    content: [
      "As a parent, ensuring your baby's safety is your top priority. Baby skin is 30% thinner than adult skin and more permeable to chemicals, making ingredient awareness especially important for little ones.",
      "## Ingredients to Avoid in Baby Products",
      "While not all products containing these are necessarily harmful, many parents prefer to avoid: Fragrance/Parfum (can contain hidden allergens), Phthalates (found in some fragranced products), Talc (concerns about contamination), Formaldehyde-releasing preservatives (like DMDM hydantoin), and Certain dyes and artificial colors.",
      "## Understanding 'Baby-Safe' Claims",
      "Unfortunately, terms like 'baby-safe,' 'gentle,' or 'natural' aren't strictly regulated. A product can claim to be gentle while still containing ingredients you might prefer to avoid. Always read the ingredient list rather than relying on marketing claims.",
      "## Recommended Certifications",
      "Look for legitimate certifications like: ECOCERT (organic cosmetics certification), COSMOS (international organic certification), and Dermatologically tested (though this only means it was tested, not that it passed specific criteria).",
      "## Essential Baby Products to Scrutinize",
      "Pay special attention to: Baby wipes (used frequently, high skin contact), Diaper cream (applied to sensitive areas), Baby lotion and oils (full body application), Baby shampoo and wash (avoid eye irritants), and Laundry detergent (residue on clothes contacts skin).",
      "## Building a Safe Routine",
      "Less is often more with babies. Many dermatologists recommend plain water for newborns and minimal products in the early months. When you do use products, patch test first on a small area of skin.",
      "Purelytics' Parent & Baby-Safe Mode applies extra scrutiny to flagged ingredients, helping you quickly identify what's suitable for your little one."
    ],
    relatedPosts: ["allergen-awareness", "understanding-parabens", "natural-vs-synthetic"]
  },
  "sulfates-in-shampoo": {
    title: "Sulfates in Shampoo: Friend or Foe?",
    excerpt: "Discover the truth about sulfates in hair care products. Learn when they're safe and when you might want to avoid them.",
    category: "ingredient-safety",
    categoryLabel: "Ingredient Safety",
    icon: Beaker,
    readTime: "4 min read",
    date: "Dec 3, 2025",
    content: [
      "Sulfates are surfactants – cleaning agents that create the foamy lather we associate with cleanliness. They're effective at removing oil, dirt, and product buildup from hair and scalp.",
      "## Common Sulfates in Hair Care",
      "The most common sulfates you'll encounter are: Sodium Lauryl Sulfate (SLS), Sodium Laureth Sulfate (SLES), and Ammonium Lauryl Sulfate. These are derived from coconut or palm kernel oil and have been used safely in personal care products for decades.",
      "## Why Some People Avoid Sulfates",
      "Sulfates can be too effective for some hair types. They may: Strip color from dyed hair faster, Dry out already dry or curly hair, Irritate sensitive scalps, and Cause frizz in textured hair.",
      "## When Sulfates Are Fine",
      "If you have oily hair, a healthy scalp, don't color your hair, or work in environments where hair gets particularly dirty, sulfate shampoos might work well for you. They're excellent at thorough cleaning.",
      "## Sulfate-Free Alternatives",
      "Sulfate-free shampoos use gentler surfactants like: Sodium Cocoyl Isethionate, Decyl Glucoside, Coco-Betaine, and Sodium Lauroyl Sarcosinate. These cleanse without stripping as much natural oil.",
      "## Finding Your Balance",
      "Consider alternating between sulfate and sulfate-free shampoos, or using sulfates only for occasional clarifying washes. Your hair's needs may also change with seasons, styling habits, and overall health.",
      "Use Purelytics to instantly identify sulfates and their alternatives in any hair care product you're considering."
    ],
    relatedPosts: ["understanding-parabens", "natural-vs-synthetic", "allergen-awareness"]
  },
  "natural-vs-synthetic": {
    title: "Natural vs Synthetic Ingredients: The Real Difference",
    excerpt: "Not all natural ingredients are safe, and not all synthetic ones are harmful. Learn how to evaluate ingredients objectively.",
    category: "product-analysis",
    categoryLabel: "Product Analysis",
    icon: Leaf,
    readTime: "8 min read",
    date: "Dec 1, 2025",
    content: [
      "The natural versus synthetic debate is one of the most misunderstood topics in consumer products. The truth is far more nuanced than marketing would have you believe.",
      "## The 'Natural' Fallacy",
      "Many naturally occurring substances are harmful – poison ivy is natural, as are arsenic and snake venom. Conversely, many synthetic ingredients are perfectly safe and even identical to their natural counterparts at the molecular level.",
      "## When Natural Isn't Better",
      "Essential oils, though natural, can cause severe allergic reactions and photosensitivity. Some natural preservatives are less effective than synthetic ones, leading to contaminated products. Plant extracts can contain allergens and irritants. 'Natural' doesn't mean pesticide-free or sustainable.",
      "## When Synthetic Is Safe",
      "Many synthetic ingredients are: Highly purified and consistent, Extensively tested for safety, More stable and effective, Sometimes identical to natural versions (like synthetic vitamin E).",
      "## How to Evaluate Ingredients",
      "Instead of asking 'Is it natural?', ask: Has it been tested for safety? At what concentration is it used? Does it have a good track record? Are there any red flags for my specific concerns (allergies, pregnancy, etc.)?",
      "## The Concentration Factor",
      "Almost anything can be harmful at high enough concentrations, including water. Most concerning ingredients are only problematic above certain thresholds – thresholds that are regulated and rarely exceeded in commercial products.",
      "## Making Smart Choices",
      "Focus on understanding specific ingredients rather than broad categories. Avoid products with ingredients you're specifically sensitive to, regardless of their origin. Consider the overall formulation, not just individual ingredients.",
      "Purelytics helps you cut through the marketing noise by providing objective, science-based information about every ingredient."
    ],
    relatedPosts: ["understanding-parabens", "sulfates-in-shampoo", "allergen-awareness"]
  },
  "allergen-awareness": {
    title: "Common Allergens Hidden in Everyday Products",
    excerpt: "From fragrances to preservatives, discover the most common allergens lurking in your daily products and how to spot them.",
    category: "health-awareness",
    categoryLabel: "Health Awareness",
    icon: Heart,
    readTime: "6 min read",
    date: "Nov 28, 2025",
    content: [
      "Allergic reactions to everyday products are more common than you might think. Understanding where allergens hide helps you make safer choices and identify triggers when reactions occur.",
      "## The Top Hidden Allergens",
      "The most common allergens in personal care and household products include: Fragrance (can contain dozens of potentially allergenic chemicals), Methylisothiazolinone (MI) and Methylchloroisothiazolinone (MCI) – preservatives, Lanolin (from sheep's wool), Cocamidopropyl betaine (derived from coconut), and Propylene glycol.",
      "## Where 'Fragrance' Hides Allergens",
      "The term 'fragrance' or 'parfum' on a label can represent a blend of dozens of chemicals. Companies aren't required to disclose individual fragrance components, making this a significant concern for sensitive individuals.",
      "## Reading Labels for Allergens",
      "In the EU, 26 fragrance allergens must be listed if above certain concentrations. Look for: Limonene, Linalool, Citronellol, Geraniol, Eugenol, and Coumarin. These are among the most common fragrance allergens.",
      "## Cross-Reactivity",
      "If you're allergic to one substance, you might react to related chemicals. For example: Rubber/latex allergies may cross-react with certain foods, Aspirin sensitivity might mean reaction to salicylates in skincare, and Nickel allergy can be triggered by products processed with nickel.",
      "## Building an Allergen Profile",
      "Keep a diary when reactions occur, noting: Products used in the 24-48 hours before, New ingredients introduced, Environmental factors, and Where on the body the reaction occurred.",
      "## Patch Testing",
      "Before using a new product extensively, apply a small amount to your inner forearm or behind your ear. Wait 24-48 hours. This simple test can prevent full-body reactions.",
      "Purelytics' Allergy-Aware Personalization lets you flag specific allergens so you're immediately warned when scanning products."
    ],
    relatedPosts: ["understanding-parabens", "baby-safe-products", "natural-vs-synthetic"]
  }
};

const BlogArticle = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id || !blogPostsData[id]) {
    return <Navigate to="/blog" replace />;
  }

  const post = blogPostsData[id];
  const Icon = post.icon;

  const relatedPosts = post.relatedPosts
    .filter(postId => blogPostsData[postId])
    .map(postId => ({
      id: postId,
      ...blogPostsData[postId]
    }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        {/* Article Header */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back Link */}
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Category */}
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Icon className="w-4 h-4" />
                {post.categoryLabel}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
                <button className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-12 lg:py-16">
          <div className="container">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl mx-auto prose prose-lg prose-gray dark:prose-invert"
            >
              {post.content.map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-10 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-6">
                    {paragraph}
                  </p>
                );
              })}
            </motion.article>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 lg:py-24 bg-muted/30">
            <div className="container">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {relatedPosts.map((relatedPost) => {
                  const RelatedIcon = relatedPost.icon;
                  return (
                    <motion.article
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="group"
                    >
                      <Link to={`/blog/${relatedPost.id}`} className="block h-full">
                        <div className="h-full bg-card rounded-xl border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                          <div className="h-24 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <RelatedIcon className="w-8 h-8 text-primary/30" />
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                              {relatedPost.title}
                            </h3>
                            <span className="text-xs text-muted-foreground mt-2 block">
                              {relatedPost.readTime}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 lg:py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to decode your products?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join our beta to get instant ingredient analysis on any product you scan.
              </p>
              <Link
                to="/#beta"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25"
              >
                Join Beta Waitlist
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogArticle;
