
import React, { useState } from "react";
import { FirebaseUser } from "../types";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { 
  LogOut, 
  Save, 
  FileText, 
  Download, 
  LayoutDashboard, 
  Sprout, 
  User as UserIcon,
  MessageSquare,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from "docx";
import saveAs from "file-saver";
import axios from "axios";





interface ProjectPageProps {
  user: FirebaseUser;
  onLogout: () => void;
}

export default function ProjectPage({ user, onLogout }: ProjectPageProps) {
  const [formData, setFormData] = useState({
    measurement1: "",
    measurement2: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveReport = async () => {
    if (!user.uid) return;
    try {
      setSaving(true);
      const reportRef = doc(db, "reports", user.uid);
      await setDoc(reportRef, {
        userId: user.uid,
        userName: user.displayName || "User",
        email: user.email,
        ...formData,
        updatedAt: serverTimestamp(),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error saving report.");
    } finally {
      setSaving(false);
    }
  };

const generateWord = async () => {
    const docFile = new Document({
      sections: [{
        children: [
          new Paragraph({ text: "Land Measurement Report", heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
          new Paragraph({ text: `Surveyor: ${user.displayName || "N/A"}`, spacing: { after: 120 } }),
          new Paragraph({ text: `Date: ${new Date().toLocaleDateString()}`, spacing: { after: 400 } }),
          new Paragraph({ text: "Primary Metric: " + formData.measurement1 }),
          new Paragraph({ text: "Boundary Perimeter: " + formData.measurement2 }),
          new Paragraph({ text: "Observations: " + formData.notes }),
        ],
      }],
    });
    const blob = await Packer.toBlob(docFile);
    saveAs(blob, "LandScale_Report.docx");
  };



const generatePDF = () => {
  const element = document.getElementById("preview-content");
  if (!element) return;

  const html2pdf = (window as any).html2pdf;
  if (!html2pdf) {
    alert("PDF library not loaded yet.");
    return;
  }

  // Clone to avoid UI flicker
  const clone = element.cloneNode(true) as HTMLElement;

  clone.style.width = "210mm";     // A4 width
  clone.style.minHeight = "297mm";
  clone.style.padding = "20mm";
  clone.style.background = "white";

  const opt = {
    margin: 0,
    filename: "LandScale_Report.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 3,            // 🔥 KEY FOR ACCURACY
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  html2pdf().set(opt).from(clone).save();
};


  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sprout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">LandScale Pro</h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Official Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-600 hidden sm:block">{user.displayName}</span>
          <button onClick={onLogout} className="text-slate-400 hover:text-red-600 transition-colors"><LogOut size={20} /></button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar Inputs */}
        <aside className="w-full lg:w-[400px] bg-white border-r p-8 overflow-y-auto space-y-8">
          <div className="space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-600">
              <LayoutDashboard size={20} /> Field Data
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Primary Area (m²)</label>
                <input name="measurement1" value={formData.measurement1} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. 1,240.5" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Perimeter (m)</label>
                <input name="measurement2" value={formData.measurement2} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none" placeholder="e.g. 450.2" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Field Notes</label>
                <textarea name="notes" rows={5} value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none resize-none" placeholder="Soil quality, vegetation, etc..." />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <button onClick={saveReport} disabled={saving} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50">
                <Save size={18} /> {saving ? "Saving..." : "Save Data"}
              </button>
              {showSuccess && <div className="text-emerald-600 text-xs font-bold text-center animate-bounce">Data synchronized!</div>}
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={generatePDF} className="bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:opacity-90"><FileText size={16}/> PDF</button>
                <button onClick={generateWord} className="bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:opacity-90"><Download size={16}/> Word</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Live Preview Paper */}
        <main className="flex-1 bg-slate-100 p-8 md:p-12 overflow-y-auto flex justify-center no-scrollbar">
          <div id="preview-content" className="w-full max-w-[800px] bg-white shadow-2xl p-16 min-h-[1100px] flex flex-col border border-slate-200 animate-fade-in">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-12">
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Land Scale Report</h1>
                <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px]">Official Assessment Document</p>
              </div>
              <div className="text-right text-[10px] text-slate-400 font-bold uppercase">
                <p>Ref: LSR-{user.uid.slice(0,8)}</p>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-16 text-sm">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Surveyor</h4>
                <p className="font-bold text-slate-900">{user.displayName || "N/A"}</p>
                <p className="text-slate-500">{user.email}</p>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform</h4>
                <p className="font-bold text-slate-900 tracking-tight">LandScale Cloud v1.0</p>
                <p className="text-slate-500 italic">Verified Submission</p>
              </div>
            </div>

            <div className="space-y-12 flex-1">
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 border-b pb-2 mb-6">Metrics Analysis</h2>
                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Measured Area</p>
                    <p className="text-3xl font-black text-slate-900">{formData.measurement1 || "—"} <span className="text-xs font-normal text-slate-400 ml-1">m²</span></p>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Perimeter Length</p>
                    <p className="text-3xl font-black text-slate-900">{formData.measurement2 || "—"} <span className="text-xs font-normal text-slate-400 ml-1">m</span></p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 border-b pb-2 mb-6">Field Observations</h2>
                <div className="bg-slate-50 p-10 rounded-2xl border border-slate-100 min-h-[200px] text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                  {formData.notes || "No significant observations recorded for this session. Use the management console to enter real-time surveyor notes."}
                </div>
              </section>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-end">
              <div className="w-48 border-b-2 border-slate-200 pb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Signature</p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white text-[8px] font-bold mx-auto mb-2">VERIFIED</div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Stamp</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
