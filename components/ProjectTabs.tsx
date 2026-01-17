
import React, { useState } from "react";
import { FirebaseUser } from "../types";
import { LogOut, Plus, BookOpen, Sprout, Clock, ChevronRight } from "lucide-react";

interface ProjectTabsProps {
  user: FirebaseUser;
  onLogout: () => void;
  onStartManual: () => void;
  onStartTemplate: () => void;
}

export default function ProjectTabs({ user, onLogout, onStartManual, onStartTemplate }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"add" | "template">("add");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transition-transform hover:scale-105">
              <Sprout size={22} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter text-slate-900 block leading-none">LANDSCALE</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Management</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 border-r pr-6 border-slate-100">
              <div className="text-right">
                <p className="text-sm font-black text-slate-900 leading-none">{user.displayName}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Surveyor</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-black border-2 border-white shadow-sm uppercase">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-600 font-bold text-sm transition-all hover:bg-red-50 rounded-xl">
              <LogOut size={18} /> 
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 w-full flex-1 flex flex-col items-center">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Workspace</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your ecological and topographical assessments.</p>
          </div>
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border shadow-sm h-fit">
            <button 
              onClick={() => setActiveTab("add")} 
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "add" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Plus size={16} /> Manual Entry
            </button>
            <button 
              onClick={() => setActiveTab("template")} 
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "template" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <BookOpen size={16} /> Templates
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 p-16 md:p-24 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 text-slate-50 opacity-20 pointer-events-none transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
              <Sprout size={320} />
            </div>
            <div className="relative z-10 max-w-2xl">
              {activeTab === "add" ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-10 shadow-sm">
                    <Plus size={40} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Launch Custom Assessment</h2>
                  <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">Build a manual project from the ground up. Best for non-standardized sites that require custom metric tracking and on-the-fly observations.</p>
                  <button 
                    onClick={onStartManual} 
                    className="px-12 py-6 bg-emerald-600 text-white rounded-2xl font-black text-base uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-[0_30px_60px_-15px_rgba(5,150,105,0.4)] hover:translate-y-[-4px] active:translate-y-[0px] flex items-center gap-4"
                  >
                    Open Manual Console <ChevronRight size={20} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 mb-10 shadow-sm">
                    <BookOpen size={40} />
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight">Protocol Library</h2>
                  <p className="text-slate-500 text-xl mb-12 leading-relaxed font-medium">Browse our library of pre-configured assessment templates including Modern Executive, Engineering Blueprint, and Luxury Estate formats.</p>
                  <button 
                    onClick={onStartTemplate} 
                    className="px-12 py-6 bg-blue-600 text-white rounded-2xl font-black text-base uppercase tracking-widest hover:bg-blue-700 transition-all shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] hover:translate-y-[-4px] active:translate-y-[0px] flex items-center gap-4"
                  >
                    Browse Protocols <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
