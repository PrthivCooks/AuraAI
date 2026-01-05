
import React, { useState } from 'react';
import { CoPilotAnalysis, UncertaintyLevel, IngredientInsight } from '../types';

interface ReasoningViewProps {
  analysis: CoPilotAnalysis;
  onReset: () => void;
  onRefine: (answer: string) => void;
  isRefining: boolean;
}

const UncertaintyBadge: React.FC<{ level: UncertaintyLevel, reason?: string }> = ({ level, reason }) => {
  const colors = {
    [UncertaintyLevel.LOW]: "bg-emerald-50 text-emerald-700 border-emerald-100",
    [UncertaintyLevel.MEDIUM]: "bg-amber-50 text-amber-700 border-amber-100",
    [UncertaintyLevel.HIGH]: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div className="group relative inline-block">
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[level]}`}>
        {level} Uncertainty
      </span>
      {reason && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
          {reason}
        </div>
      )}
    </div>
  );
};

const InsightCard: React.FC<{ insight: IngredientInsight }> = ({ insight }) => {
  return (
    <div className={`bg-white border p-8 rounded-[2rem] transition-all ${insight.isPrimaryConcern ? 'border-indigo-200 ring-4 ring-indigo-50/50 shadow-indigo-100 shadow-lg' : 'border-slate-100 shadow-sm'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-semibold text-slate-800">{insight.ingredient}</h4>
          {insight.isPrimaryConcern && (
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          )}
        </div>
        <UncertaintyBadge level={insight.uncertainty} reason={insight.uncertaintyReason} />
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Impact</p>
          <p className="text-slate-600 text-sm leading-relaxed">{insight.impact}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
          <div>
             <p className="text-xs font-bold text-indigo-500 uppercase mb-1">Perspective</p>
             <p className="text-slate-700 text-sm leading-relaxed">{insight.whyItMatters}</p>
          </div>
          <div>
             <p className="text-xs font-bold text-amber-600 uppercase mb-1">The Trade-off</p>
             <p className="text-slate-700 text-sm leading-relaxed italic">{insight.tradeoff}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReasoningView: React.FC<ReasoningViewProps> = ({ analysis, onReset, onRefine, isRefining }) => {
  const [refinementText, setRefinementText] = useState('');

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Inferred Intent Header */}
      <section className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Inferred Intent</span>
            <div className="h-px flex-grow bg-indigo-500/50"></div>
          </div>
          <h2 className="text-3xl serif italic leading-tight">
            "I'm looking at this with <span className="text-indigo-200 underline decoration-indigo-300 underline-offset-4">{analysis.inferredIntent.concern}</span> in mind."
          </h2>
          <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">
            {analysis.inferredIntent.reasoning}
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-400 rounded-full blur-[60px] opacity-30"></div>
      </section>

      {/* Clarifying Questions (Refinement System) */}
      {analysis.clarifyingQuestions.length > 0 && (
        <section className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-500">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full text-amber-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900">A quick question to refine my perspective:</p>
              <p className="text-amber-800 text-lg serif italic">"{analysis.clarifyingQuestions[0]}"</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={refinementText}
              onChange={(e) => setRefinementText(e.target.value)}
              placeholder="Your response..."
              className="flex-grow bg-white border border-amber-200 px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-300"
              onKeyPress={(e) => e.key === 'Enter' && refinementText && onRefine(refinementText)}
            />
            <button 
              onClick={() => refinementText && onRefine(refinementText)}
              disabled={!refinementText || isRefining}
              className="bg-amber-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-700 disabled:opacity-50 transition-all"
            >
              {isRefining ? 'Refining...' : 'Refine'}
            </button>
          </div>
        </section>
      )}

      {/* Overall Narrative */}
      <section className="px-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">The Holistic View</h3>
        <p className="text-xl text-slate-700 leading-relaxed serif">
          {analysis.overallNarrative}
        </p>
      </section>

      {/* Ingredient Insights */}
      <section className="space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Meaningful Signals</h3>
        <div className="grid gap-6">
          {/* Primary concerns first */}
          {analysis.insights.filter(i => i.isPrimaryConcern).map((insight, idx) => (
            <InsightCard key={`p-${idx}`} insight={insight} />
          ))}
          {/* Then secondary insights */}
          {analysis.insights.filter(i => !i.isPrimaryConcern).map((insight, idx) => (
            <InsightCard key={`s-${idx}`} insight={insight} />
          ))}
        </div>
      </section>

      {/* Action Footer */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex-grow">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Co-Pilot Recommendation</h3>
          <p className="text-lg text-white font-medium">{analysis.suggestedAction}</p>
        </div>
        <button 
          onClick={onReset}
          className="whitespace-nowrap bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors shadow-lg"
        >
          Reset
        </button>
      </section>
    </div>
  );
};
