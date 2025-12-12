import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Linkedin, 
  Instagram,
  Mail, 
  Eye, 
  Target, 
  Heart,
  Cpu,
  Scan,
  Sparkles,
  Users,
  MapPin
} from "lucide-react";
import founderPhoto from "@/assets/founder-photo.jpg";

const values = [
  {
    icon: Eye,
    title: "Our Vision",
    description: "To create a world where every individual has instant access to comprehensive product safety information, enabling healthier choices for themselves and their families. We envision a future where transparency is the norm, not the exception."
  },
  {
    icon: Target,
    title: "Our Mission",
    description: "To leverage cutting-edge technology to analyze and decode product ingredients, providing clear, actionable insights that empower consumers to make informed health decisions. We're committed to making product safety accessible to everyone."
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "Transparency, scientific accuracy, and user privacy are at the core of everything we do. We believe in empowering individuals with knowledge while respecting their data and privacy. Your health journey is personal, and we're here to support it."
  }
];

const features = [
  {
    icon: Cpu,
    title: "Advanced Analysis",
    description: "Our proprietary ToxiScore™ algorithm analyzes thousands of ingredients against scientific databases to provide instant safety ratings."
  },
  {
    icon: Scan,
    title: "Real-Time Scanning",
    description: "Simply scan any product label with your phone camera and get comprehensive ingredient analysis in seconds."
  },
  {
    icon: Sparkles,
    title: "Personalized Insights",
    description: "Receive tailored recommendations based on your health profile and preferences for safer product alternatives."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of health-conscious users making smarter choices and contributing to a healthier future."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 lg:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] bg-soft-blue/8 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-primary font-semibold mb-3">About Purelytics</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Empowering healthier choices through{" "}
              <span className="text-primary">intelligent technology</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to democratize health information and empower individuals 
              to make informed choices about the products they use every day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-card border border-border/50">
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center">
                {/* Founder Image */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-elevated">
                  <img 
                    src={founderPhoto} 
                    alt="Saikoushik Nalubola - Founder & CEO of Purelytics" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="text-center lg:text-left">
                  <p className="text-primary font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Founded by</p>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                    Saikoushik Nalubola
                  </h2>
                  <p className="text-muted-foreground mb-3 sm:mb-4 text-sm sm:text-base">Founder & CEO • Established 2025</p>
                  
                  <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    With a passion for health technology and consumer safety, Saikoushik founded 
                    Purelytics to bridge the gap between complex ingredient labels and everyday consumers. 
                    Our mission is to democratize health information and empower informed choices.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.linkedin.com/in/saikoushiknalubola/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://instagram.com/pure_lytics" target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="mailto:purelytics@gmail.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Contact
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-12 sm:py-16 lg:py-24">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-card border border-border/50 hover:shadow-elevated transition-shadow duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 lg:py-24 bg-charcoal text-primary-foreground">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <p className="text-primary font-semibold mb-3">What We Do</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Revolutionizing how people understand product safety
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 text-center hover:bg-primary-foreground/10 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Made in India */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber/10 text-amber font-medium text-sm mb-6">
              <MapPin className="w-4 h-4" />
              Proudly Made in Bharat
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Developed with pride in India
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Built in Warangal, Telangana with a commitment to advancing health technology 
              and empowering consumers across India and beyond. We understand the unique 
              needs of Indian consumers and regulatory requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Join Us on Our Mission
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Be part of the health revolution. Start making informed choices today.
            </p>
            <Button variant="hero" size="xl" asChild>
              <a href="/#beta">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}