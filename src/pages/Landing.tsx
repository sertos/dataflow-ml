import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Database, Sparkles, Zap, Shield, ChevronRight } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

export default function Landing() {
  const { t } = useAppContext();

  return (
    <div className="flex-1 w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden w-full h-[80vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/5 dark:to-transparent z-0" />
        
        {/* Animated Background Elements */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">{t("hero.tagline")}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto font-light"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/upload" className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-dark text-white rounded-full font-medium transition-all group flex items-center justify-center gap-2 shadow-xl shadow-primary/25">
              {t("hero.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/#features" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white rounded-full font-medium transition-all border border-slate-200 dark:border-white/10 flex items-center justify-center gap-2">
              {t("hero.learnMore")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-black w-full relative z-10 border-t border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{t("features.title")}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{t("features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Database, title: "feat.smart.title", desc: "feat.smart.desc" },
              { icon: Zap, title: "feat.instant.title", desc: "feat.instant.desc" },
              { icon: Shield, title: "feat.security.title", desc: "feat.security.desc" }
            ].map((feat, idx) => (
               <motion.div 
                 key={feat.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="p-8 rounded-2xl glass-panel group hover:-translate-y-1 transition-all duration-300"
               >
                 <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                   <feat.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold font-display mb-3">{t(feat.title)}</h3>
                 <p className="text-slate-600 dark:text-slate-400">{t(feat.desc)}</p>
               </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
