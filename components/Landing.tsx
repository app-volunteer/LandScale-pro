
import React from "react";
import { Sprout, Map, BarChart3, ClipboardCheck, ArrowRight } from "lucide-react";

type Props = {
  onGetStarted: () => void;
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default function Landing({ onGetStarted }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Sprout size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">LandScale</span>
        </div>
        <button 
          onClick={onGetStarted}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
        >
          Sign In
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next Generation Land Management
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Measure, monitor, and <br />
          <span className="text-emerald-600">improve land outcomes.</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one platform for ecological surveyors and landowners to track site indicators, 
          collect field data, and generate professional PDF reports instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 group"
          >
            Get Started Free
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={ClipboardCheck} 
            title="Field Surveys" 
            description="Robust data collection tools designed for the field. Record measurements, soil quality, and more." 
          />
          <FeatureCard 
            icon={Map} 
            title="Site Indicators" 
            description="Visualize complex datasets on intuitive dashboards. Track changes over time with precision." 
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Instant Reports" 
            description="Export professional LaTeX-style PDF and Word documents with one click for stakeholders." 
          />
        </div>
      </main>
    </div>
  );
}
