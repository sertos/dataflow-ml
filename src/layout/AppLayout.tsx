import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAppContext } from "../contexts/AppContext";
import { Moon, Sun, Globe, LayoutDashboard, UploadCloud, BarChart3, FileText, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export function AppLayout() {
  const { theme, toggleTheme, language, setLanguage, t } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  const isPublicPage = location.pathname === "/" || location.pathname === "/pricing";

  const appLinks = [
    { name: t("nav.dashboard"), path: "/dashboard", icon: LayoutDashboard },
    { name: t("upload.title"), path: "/upload", icon: UploadCloud },
    { name: t("analysis.title"), path: "/analysis", icon: BarChart3 },
    { name: t("reports.title"), path: "/reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-50 transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-display font-bold">
                DF
              </div>
              <Link to="/" className="text-xl font-display font-bold tracking-tight">
                DataFlow<span className="text-primary">ML</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isPublicPage ? (
                <>
                  <Link to="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">{t("nav.features")}</Link>
                  <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">{t("nav.pricing")}</Link>
                </>
              ) : (
                <div className="flex space-x-6">
                  {appLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "text-sm font-medium flex items-center gap-2 transition-colors",
                        location.pathname === link.path 
                          ? "text-primary dark:text-primary" 
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" title="Toggle Language">
                <div className="flex items-center gap-1 text-xs font-semibold uppercase">
                  <Globe className="w-4 h-4" />
                  {language}
                </div>
              </button>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              
              {isPublicPage && (
                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors rounded-full shadow-lg shadow-primary/20">
                  {t("nav.dashboard")}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/10 bg-white dark:bg-[#18181b]"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {!isPublicPage && appLinks.map(link => (
                 <Link key={link.path} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                   <div className="flex items-center gap-2">
                     <link.icon className="w-5 h-5"/>
                     {link.name}
                   </div>
                 </Link>
              ))}
              <div className="flex items-center gap-4 px-3 py-4 mt-4 border-t border-slate-200 dark:border-white/10">
                <button onClick={toggleTheme} className="flex items-center gap-2">
                   {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                   {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
                </button>
                <button onClick={toggleLanguage} className="flex items-center gap-2 ml-4">
                  <Globe className="w-5 h-5" />
                  {language.toUpperCase()}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col h-full w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
