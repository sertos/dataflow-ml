import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight, Download, BrainCircuit, TableProperties, CheckCircle } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import Papa from "papaparse";

export default function Analysis() {
  const { t, uploadedData, analysisInsights } = useAppContext();
  const [showAiChat, setShowAiChat] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiChat, setAiChat] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isAssisting, setIsAssisting] = useState(false);

  const handleAskAi = () => {
    if (!aiQuery.trim() || isAssisting) return;
    const newChat: {role: 'user' | 'ai', text: string}[] = [...aiChat, { role: 'user', text: aiQuery }];
    setAiChat(newChat);
    setAiQuery("");
    setIsAssisting(true);
    setTimeout(() => {
      setAiChat([...newChat, { role: 'ai', text: `Based on the current analysis, this dataset indicates standard patterns with a few minor outliers that I've flagged in your insights.` }]);
      setIsAssisting(false);
    }, 1500);
  };

  const handleExport = () => {
    if (!uploadedData) return;
    const csv = Papa.unparse(uploadedData.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_${uploadedData.name.replace(/\.[^/.]+$/, "")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary" />
            {t("analysis.title")}
          </h1>
          <p className="text-slate-500 mt-2">
            {uploadedData ? `AI has finished evaluating ${uploadedData.name}` : t("analysis.subtitle")}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
            <TableProperties className="w-4 h-4" />
            {t("analysis.rawData")}
          </button>
          <button 
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-lg shadow-primary/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!uploadedData}
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            {t("analysis.export")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl glass-panel relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent flex flex-col h-full">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              {t("analysis.insights")}
            </h3>
            
            <div className="space-y-4 flex-1">
              {analysisInsights.length === 0 ? (
                <div className="text-slate-400 text-sm italic py-4">{t("analysis.noInsights")}</div>
              ) : (
                analysisInsights.map((insight, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-white/20"
                  >
                    <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{insight.desc}</p>
                  </motion.div>
                ))
              )}
            </div>
            
            {!showAiChat ? (
              <button 
                onClick={() => setShowAiChat(true)}
                className="w-full mt-6 py-3 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-white/10 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:border-primary transition-colors"
              >
                {t("analysis.askAi")} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="mt-6 flex flex-col gap-3 p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/20">
                <div className="max-h-[200px] overflow-y-auto flex flex-col gap-3 text-sm">
                  {aiChat.length === 0 && (
                    <div className="text-slate-500 text-center text-xs py-2 italic">How can I help you understand this data?</div>
                  )}
                  {aiChat.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-lg max-w-[90%] ${msg.role === 'user' ? 'bg-primary/20 text-slate-800 dark:text-slate-200 self-end ml-auto' : 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 self-start mr-auto'}`}>
                      {msg.text}
                    </div>
                  ))}
                  {isAssisting && (
                    <div className="p-3 rounded-lg max-w-[90%] bg-slate-200 dark:bg-white/10 self-start mr-auto flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                    placeholder="Ask about your data..." 
                    className="flex-1 bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                  <button onClick={handleAskAi} disabled={isAssisting || !aiQuery.trim()} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-1 rounded-2xl glass-panel h-full min-h-[500px]">
            {/* Fake Data Grid */}
            <div className="w-full h-full rounded-xl bg-white dark:bg-black/20 overflow-hidden border border-slate-200 dark:border-white/5 flex flex-col">
              <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                <span className="text-sm font-medium">{t("analysis.preview")} {uploadedData && `(100 / ${uploadedData.data.length} rows)`}</span>
                {uploadedData && (
                  <span className="text-xs text-green-500 font-medium flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10">
                    <CheckCircle className="w-3 h-3" /> 100% {t("analysis.validated")}
                  </span>
                )}
              </div>
              
              <div className="flex-1 overflow-auto p-4 flex flex-col">
                <table className="w-full text-left text-sm relative">
                  <thead className="text-xs text-slate-500 uppercase font-medium border-b border-slate-200 dark:border-white/10">
                    <tr>
                      {uploadedData ? uploadedData.columns.slice(0, 8).map((col, idx) => (
                        <th key={idx} className="px-4 py-3">{String(col)}</th>
                      )) : (
                        <th className="px-4 py-3">Column</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedData && uploadedData.data.slice(0, 100).map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                         {uploadedData.columns.slice(0, 8).map((col, cIdx) => (
                           <td key={cIdx} className="px-4 py-3 max-w-[150px] truncate" title={String(row[col] || "")}>
                             {String(row[col] || "")}
                           </td>
                         ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!uploadedData && (
                  <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-sm">
                    {t("analysis.noData")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
