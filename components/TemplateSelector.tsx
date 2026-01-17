
import React, { useState, useEffect } from "react";
import { Template } from "../types";
import { BookOpen, ArrowLeft, RefreshCw, FileText, Download, Save, CheckCircle, Eye } from "lucide-react";
import { auth } from "../firebase";
import { fetchTemplates, saveProjectToFirestore } from "../utils/templates";
import { Document, Packer, Paragraph, HeadingLevel } from "docx";
import saveAs from "file-saver";

interface TemplateSelectorProps {
  onBack: () => void;
}

const fieldConfig: Record<string, { label: string; placeholder: string; type: string; rows?: number }> = {
  plotNumber: { label: "Plot Number", placeholder: "e.g., PLOT-001", type: "text" },
  ownerName: { label: "Owner Name", placeholder: "e.g., John Doe", type: "text" },
  area: { label: "Area (m²)", placeholder: "e.g., 1500", type: "text" },
  surveyDate: { label: "Survey Date", placeholder: "mm/dd/yyyy", type: "date" },
  location: { label: "Location", placeholder: "e.g., North Field, Section A", type: "text" },
  notes: { label: "Notes", placeholder: "Additional observations and notes...", type: "textarea", rows: 6 },
};

const extractFieldNamesFromTemplate = (html: string): string[] => {
  const regex = /\{\{(\w+)\}\}/g;
  const matches = new Set<string>();
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.add(match[1]);
  }
  return Array.from(matches);
};

export default function TemplateSelector({ onBack }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [templateFields, setTemplateFields] = useState<string[]>([]);
  const [filledHtml, setFilledHtml] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const fetched = await fetchTemplates();
      setTemplates(fetched);
    } catch (err) {
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilledHtml = (currentFormData: Record<string, string>, fields: string[], template: Template) => {
    let html = template.html;
    fields.forEach((field) => {
      const value = currentFormData[field] || `<span style="color: #cbd5e1; font-style: italic; border-bottom: 1px dashed #cbd5e1;">[Pending: ${fieldConfig[field]?.label || field}]</span>`;
      const placeholder = new RegExp(`\\{\\{${field}\\}\\}`, "g");
      html = html.replace(placeholder, value);
    });
    setFilledHtml(html);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    if (selectedTemplate) {
      updateFilledHtml(newFormData, templateFields, selectedTemplate);
    }
  };

  const handleUseTemplate = (t: Template) => {
    setSelectedTemplate(t);
    const fields = extractFieldNamesFromTemplate(t.html);
    setTemplateFields(fields);
    const newFormData: Record<string, string> = {};
    fields.forEach((field) => { newFormData[field] = ""; });
    setFormData(newFormData);
    updateFilledHtml(newFormData, fields, t);
    setUsingTemplate(true);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("document-preview");
    if (!element) return;
    const html2pdf = (window as any).html2pdf;
    if (html2pdf) {
      html2pdf().set({
        margin: 0,
        filename: `${selectedTemplate?.name || "LandScale_Report"}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      }).from(element).save();
    }
  };

  const handleDownloadWord = async () => {
    if (!selectedTemplate) return;
    const docFile = new Document({
      sections: [{
        children: [
          new Paragraph({ text: selectedTemplate.name, heading: HeadingLevel.HEADING_1 }),
          ...templateFields.map(f => new Paragraph({ text: `${fieldConfig[f]?.label || f}: ${formData[f] || 'N/A'}` }))
        ],
      }],
    });
    const blob = await Packer.toBlob(docFile);
    saveAs(blob, `${selectedTemplate.name}.docx`);
  };

  const handleSaveData = async () => {
    const user = auth.currentUser;
    if (!selectedTemplate || !user) return;
    setSaveStatus("saving");
    try {
      await saveProjectToFirestore(user.uid, {
        userName: user.displayName,
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        formData,
        filledHtml,
      });
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("idle");
      alert("Failed to save report to Firestore.");
    }
  };

  if (usingTemplate && selectedTemplate) {
    return (
      <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-30 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setUsingTemplate(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="text-left">
              <h1 className="text-lg font-black text-slate-900 leading-none">{selectedTemplate.name}</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Live Document Workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black hover:opacity-90 shadow-lg shadow-slate-100 transition-all uppercase tracking-widest">
              <FileText size={16} /> Export PDF
            </button>
            <button onClick={handleDownloadWord} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black hover:opacity-90 shadow-lg shadow-blue-100 transition-all uppercase tracking-widest">
              <Download size={16} /> Word Doc
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <aside className="w-full lg:w-[440px] bg-white border-r flex flex-col z-20 shadow-xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-emerald-600">
                  <div className="p-2 bg-emerald-50 rounded-lg"><Eye size={20} /></div>
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Input Console</span>
                </div>
              </div>
              
              <div className="space-y-8 text-left">
                {templateFields.map((field) => (
                  <div key={field} className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {fieldConfig[field]?.label || field}
                    </label>
                    {fieldConfig[field]?.type === "textarea" ? (
                      <textarea
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleFormChange}
                        placeholder={fieldConfig[field]?.placeholder}
                        className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl p-5 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                        rows={fieldConfig[field]?.rows || 5}
                      />
                    ) : (
                      <input
                        type={fieldConfig[field]?.type || "text"}
                        name={field}
                        value={formData[field] || ""}
                        onChange={handleFormChange}
                        placeholder={fieldConfig[field]?.placeholder}
                        className="w-full border-2 border-slate-50 bg-slate-50 rounded-2xl px-5 py-4.5 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-black"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t">
              <button 
                onClick={handleSaveData} 
                disabled={saveStatus !== 'idle'}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs tracking-widest transition-all shadow-xl uppercase ${
                  saveStatus === 'success' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                }`}
              >
                {saveStatus === 'saving' ? <RefreshCw size={20} className="animate-spin" /> : saveStatus === 'success' ? <CheckCircle size={20} /> : <Save size={20} />}
                {saveStatus === 'saving' ? "SYNCING..." : saveStatus === 'success' ? "DATA SECURED" : "SYNC TO CLOUD"}
              </button>
            </div>
          </aside>

          <main className="flex-1 bg-slate-200 overflow-y-auto p-12 flex justify-center no-scrollbar relative">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] opacity-40">Document Workspace</div>
            <div 
              id="document-preview"
              className="w-full max-w-[800px] bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.3)] min-h-[1130px] animate-fade-in relative transition-all p-[60px] text-left"
            >
              <div dangerouslySetInnerHTML={{ __html: filledHtml }} />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-16">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-12 transition-all group font-black text-xs uppercase tracking-widest">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Workspace
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl rotate-3">
              <BookOpen size={32} />
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Library</h1>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Select assessment protocol</p>
            </div>
          </div>
          <button onClick={loadTemplates} className="p-4 hover:bg-white rounded-[1.5rem] text-slate-400 border-2 border-transparent hover:border-slate-100 transition-all flex items-center gap-3 font-bold text-xs uppercase tracking-widest">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-[3rem] animate-pulse"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {templates.map(t => (
              <div 
                key={t.id} 
                onClick={() => handleUseTemplate(t)} 
                className={`group cursor-pointer bg-white rounded-[3.5rem] p-12 border-2 transition-all hover:translate-y-[-10px] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] text-left ${
                  selectedTemplate?.id === t.id ? 'border-blue-600 ring-[12px] ring-blue-50' : 'border-slate-50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-colors ${selectedTemplate?.id === t.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50'}`}>
                    <FileText size={32} />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">{t.name}</h3>
                <p className="text-slate-500 text-sm mb-12 line-clamp-3 font-medium leading-relaxed">Standardized protocol for {t.name.toLowerCase()} assessments. Optimized for professional field reporting.</p>
                <button 
                  className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all uppercase"
                >
                  Launch Editor
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
