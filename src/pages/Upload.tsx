import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, FileText, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function Upload() {
  const { t, setUploadedData, setAnalysisInsights, setDashboardStats, setRecentUploads } = useAppContext();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  }, []);

  const processFile = (file: File) => {
    setIsProcessing(true);

    const handleData = (data: any[], columns: string[]) => {
      // Simulate slow processing for visual effect
      setTimeout(() => {
        setUploadedData({
          name: file.name,
          data: data,
          columns: columns
        });
        
        // Generate some basic generic insights based on the data
        const insights = [
          { title: "Data Parsed Successfully", desc: `Loaded ${data.length} rows and ${columns.length} columns from ${file.name}.`, type: "success" },
          { title: "Column Verification", desc: `Identified columns: ${columns.slice(0, 3).join(", ")}${columns.length > 3 ? "..." : ""}`, type: "info" }
        ];
        
        // Rough anomaly detection simulation (just counting nulls)
        let emptyCount = 0;
        data.forEach(row => {
            columns.forEach(col => {
                if (row[col] === null || row[col] === undefined || row[col] === "") {
                    emptyCount++;
                }
            });
        });
        
        if (emptyCount > 0) {
            insights.push({ title: "Missing Values Detected", desc: `Found ${emptyCount} empty cells across the dataset. AI suggests imputation.`, type: "warning" });
        } else {
            insights.push({ title: "Data Quality is High", desc: `No missing values detected.`, type: "success" });
        }

        setAnalysisInsights(insights);
        setDashboardStats(prev => ({
          totalDatasets: prev.totalDatasets + 1,
          processedRows: prev.processedRows + data.length,
          errorsFixed: prev.errorsFixed + emptyCount,
          timeSaved: prev.timeSaved + Math.max(1, Math.floor(data.length / 500))
        }));
        setRecentUploads(prev => [
            { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB", status: "Cleaned" },
            ...prev
        ]);
        
        setIsProcessing(false);
        navigate("/analysis");
      }, 2500);
    };

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const columns = results.meta.fields || [];
          handleData(results.data, columns);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setIsProcessing(false);
        }
      });
    } else if (file.name.endsWith('.xlsx')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = e.target?.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length > 0) {
            const columns = Object.keys(jsonData[0] as object);
            handleData(jsonData, columns);
          } else {
            handleData([], []);
          }
        } catch (error) {
           console.error("Error parsing Excel:", error);
           setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop as any,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  } as any);

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-10 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-display font-bold mb-4">{t("upload.title")}</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          {t("upload.subtitle")}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!file && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`w-full p-16 rounded-3xl border-2 border-dashed transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700 hover:border-primary/50 bg-slate-50 dark:bg-white/5'}`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 bg-white dark:bg-[#18181b] rounded-full flex items-center justify-center p-4 shadow-xl border border-slate-100 dark:border-white/10 mb-6">
              <UploadCloud className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">
              {t("upload.drag")}
            </h3>
            <p className="text-slate-500">{t("upload.click")}</p>
            
            <div className="flex gap-4 mt-8">
              <span className="text-xs font-medium px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full">CSV</span>
              <span className="text-xs font-medium px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full">XLSX</span>
              <span className="text-xs font-medium px-3 py-1 bg-slate-200 dark:bg-white/10 rounded-full">Up to 500MB</span>
            </div>
          </motion.div>
        )}

        {file && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full glass-panel p-10 rounded-3xl border border-primary/20 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-100 dark:bg-white/5">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
              />
            </div>

            <div className="relative">
              {isProcessing ? (
                <Loader2 className="w-16 h-16 text-primary mb-6 animate-spin mx-auto" />
              ) : (
                <CheckCircle className="w-16 h-16 text-green-500 mb-6 mx-auto" />
              )}
            </div>

            <h3 className="text-2xl font-display font-bold mb-2">
              {isProcessing ? t("upload.processing") : t("upload.ready")}
            </h3>
            <p className="text-slate-500 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>

            {isProcessing && (
              <div className="mt-8 text-sm text-slate-400 space-y-2 animate-pulse">
                <p>{t("upload.detecting")}</p>
                <p>{t("upload.finding")}</p>
                <p>{t("upload.removing")}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
