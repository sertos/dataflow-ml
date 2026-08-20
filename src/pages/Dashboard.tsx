import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database, AlertTriangle, CheckCircle2, Clock, FileText } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { t, dashboardStats, recentUploads } = useAppContext();

  // If there's processing, generate some mock points leading up to the final number
  const data = useMemo(() => {
     if (dashboardStats.processedRows === 0) return [];
     const points = [];
     const days = 7;
     let current = Math.floor(dashboardStats.processedRows * 0.2);
     const step = Math.floor((dashboardStats.processedRows - current) / days);
     for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        if (i === 0) current = dashboardStats.processedRows;
        else current += step + Math.floor(Math.random() * step * 0.5 - step * 0.25);
        
        points.push({
            name: date.toLocaleDateString(navigator.language, { weekday: 'short' }),
            rows: current
        })
     }
     return points;
  }, [dashboardStats.processedRows]);

  const metrics = [
    { title: t("dashboard.totalDatasets"), value: dashboardStats.totalDatasets.toString(), icon: Database, color: "text-blue-500" },
    { title: t("dashboard.processedRows"), value: dashboardStats.processedRows.toLocaleString(), icon: CheckCircle2, color: "text-green-500" },
    { title: t("dashboard.errorsFixed"), value: dashboardStats.errorsFixed.toLocaleString(), icon: AlertTriangle, color: "text-orange-500" },
    { title: t("dashboard.timeSaved"), value: `${dashboardStats.timeSaved} hrs`, icon: Clock, color: "text-purple-500" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold">{t("dashboard.title")}</h1>
        <p className="text-slate-500 mt-2">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl glass-panel relative overflow-hidden group"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{metric.title}</p>
                <h3 className="text-3xl font-bold font-display">{metric.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-slate-50 dark:bg-white/5 ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full bg-current ${metric.color} group-hover:opacity-40 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 p-6 rounded-2xl glass-panel"
        >
          <h3 className="font-display font-bold text-lg mb-6">{t("dashboard.processingVolume")}</h3>
          <div className="h-[300px] w-full flex items-center justify-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl relative">
            {data.length === 0 ? (
              <p className="text-slate-400 text-sm absolute z-10">{t("dashboard.noData")}</p>
            ) : null}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rows" stroke="#6366f1" fillOpacity={1} fill="url(#colorRows)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 p-6 rounded-2xl glass-panel flex flex-col"
        >
          <h3 className="font-display font-bold text-lg mb-6">{t("dashboard.recentUploads")}</h3>
          <div className="flex-1 flex flex-col justify-center">
            {recentUploads.length === 0 ? (
              <p className="text-slate-400 text-sm text-center">{t("dashboard.noUploads")}</p>
            ) : (
              <div className="space-y-4 w-full">
                {recentUploads.slice(0, 4).map((file, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                    <div className="p-2 bg-primary/10 text-primary rounded-md">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.size} • {file.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link to="/upload" className="mt-4 block text-center w-full py-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors">
            {t("dashboard.viewAll")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
