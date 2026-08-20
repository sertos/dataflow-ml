import { FileText, Download, FileJson, Mail } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const { t, reports, setReports, uploadedData } = useAppContext();

  const handleGenerateReport = () => {
    if (!uploadedData) {
      alert(t("reports.noDataAlert") || "Please upload a dataset first to generate a report.");
      return;
    }
    const newReport = {
      title: `Data Quality Audit - ${uploadedData.name}`,
      date: new Date().toLocaleDateString(),
      type: "PDF"
    };
    setReports(prev => [newReport, ...prev]);
  };

  const handleDownload = (report: any) => {
    if (report.type === "PDF") {
      const doc = new jsPDF();
      
      // Beautiful formatting
      doc.setFillColor(99, 102, 241); // Primary color
      doc.rect(0, 0, 210, 35, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(26);
      doc.text("DataFlow ML", 14, 23);
      
      doc.setFontSize(12);
      doc.text("Executive Analysis Report", 145, 23);
      
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(18);
      doc.text(`Report: ${report.title}`, 14, 50);
      
      doc.setFontSize(11);
      doc.setTextColor(120, 120, 120);
      doc.text(`Generated on: ${report.date}`, 14, 58);
      
      if (uploadedData) {
        // Info cards
        doc.setFillColor(248, 250, 252); // Slate-50 equivalent
        doc.setDrawColor(226, 232, 240); // Slate-200 equivalent
        doc.roundedRect(14, 68, 55, 25, 2, 2, "FD");
        doc.roundedRect(77, 68, 55, 25, 2, 2, "FD");
        doc.roundedRect(140, 68, 55, 25, 2, 2, "FD");
        
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.setFontSize(9);
        doc.text("DATASET SOURCE", 18, 76);
        doc.text("ROWS ANALYZED", 81, 76);
        doc.text("TOTAL COLUMNS", 144, 76);
        
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.setFontSize(12);
        // Truncate name if too long
        const shortName = uploadedData.name.length > 20 ? uploadedData.name.substring(0, 17) + "..." : uploadedData.name;
        doc.text(shortName, 18, 86);
        doc.text(`${uploadedData.data.length.toLocaleString()}`, 81, 86);
        doc.text(`${uploadedData.columns.length}`, 144, 86);
        
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 50);
        doc.text("Data Sample Preview", 14, 110);
        
        // Use autotable to inject a better looking table
        const tableColumn = uploadedData.columns.slice(0, 6).map(c => String(c));
        const tableRows = uploadedData.data.slice(0, 30).map(row => {
           return uploadedData.columns.slice(0, 6).map(col => String(row[col] || ""));
        });
        
        autoTable(doc, {
          startY: 115,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          styles: { fontSize: 8, font: 'helvetica', cellPadding: 3, textColor: [71, 85, 105] },
          headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 10, right: 14, bottom: 10, left: 14 }
        });
      } else {
         doc.text("No data was available at the time of generating this report.", 14, 80);
      }
      
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
      link.target = "_blank";
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const content = `Mock Report Content for: ${report.title}\nDate: ${report.date}\nStatus: Confidential`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${report.title.replace(/\s+/g, '_')}.${report.type.toLowerCase()}`);
      link.target = "_blank";
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">{t("reports.title")}</h1>
          <p className="text-slate-500 mt-2">{t("reports.subtitle")}</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium shadow-lg shadow-primary/20 transition-colors"
        >
          {t("reports.generate")}
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border-dashed border-2 border-slate-200 dark:border-white/10 mt-8">
          <FileText className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">{t("reports.noReports")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-panel flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${report.type === 'PDF' ? 'bg-red-500/10 text-red-500' : report.type === 'HTML' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                     {report.type === 'PDF' ? <FileText className="w-6 h-6" /> : report.type === 'HTML' ? <Mail className="w-6 h-6" /> : <FileJson className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-slate-500">
                    {report.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display leading-snug mb-2">{report.title}</h3>
                <p className="text-sm text-slate-500 mb-6">Generated on {report.date}</p>
              </div>
              
              <button 
                onClick={() => handleDownload(report)}
                className="w-full py-2 flex items-center justify-center gap-2 border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <Download className="w-4 h-4" /> {t("reports.download")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
