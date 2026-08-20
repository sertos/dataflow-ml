import { Check } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";

export default function Pricing() {
  const { t } = useAppContext();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full pt-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold mb-4">{t("pricing.title")}</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          {t("pricing.subtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Basic */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col">
          <h3 className="text-xl font-display font-bold tracking-tight mb-2">{t("pricing.starter")}</h3>
          <p className="text-slate-500 text-sm mb-6">{t("pricing.starter.desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-slate-500">{t("pricing.mo")}</span>
          </div>
          <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8">
            {t("pricing.getStarted")}
          </button>
          <div className="space-y-4 flex-1">
            {['feat.p1.1', 'feat.p1.2', 'feat.p1.3', 'feat.p1.4'].map((feature, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span>{t(feature)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro */}
        <div className="p-8 rounded-3xl bg-primary text-white flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-8 -translate-y-1/2">
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {t("pricing.popular")}
            </span>
          </div>
          <h3 className="text-xl font-display font-bold tracking-tight mb-2">{t("pricing.pro")}</h3>
          <p className="text-white/70 text-sm mb-6">{t("pricing.pro.desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$49</span>
            <span className="text-white/70">{t("pricing.mo")}</span>
          </div>
          <button className="w-full py-3 rounded-xl bg-white text-primary font-bold shadow-lg hover:bg-slate-50 transition-colors mb-8">
            {t("pricing.trial")}
          </button>
          <div className="space-y-4 flex-1">
            {['feat.p2.1', 'feat.p2.2', 'feat.p2.3', 'feat.p2.4', 'feat.p2.5'].map((feature, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <Check className="w-5 h-5 text-green-300 shrink-0" />
                <span>{t(feature)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise */}
        <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col">
          <h3 className="text-xl font-display font-bold tracking-tight mb-2">{t("pricing.enterprise")}</h3>
          <p className="text-slate-500 text-sm mb-6">{t("pricing.enterprise.desc")}</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$199</span>
            <span className="text-slate-500">{t("pricing.mo")}</span>
          </div>
          <button className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors mb-8">
            {t("pricing.contact")}
          </button>
          <div className="space-y-4 flex-1">
            {['feat.p3.1', 'feat.p3.2', 'feat.p3.3', 'feat.p3.4', 'feat.p3.5'].map((feature, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span>{t(feature)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
