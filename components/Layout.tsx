
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-12 flex flex-col items-center">
      <header className="w-full mb-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-full blur-[2px] opacity-80"></div>
          <h1 className="text-2xl font-medium tracking-tight serif italic">Aura</h1>
        </div>
        <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Health Co-Pilot
        </div>
      </header>
      <main className="w-full flex-grow flex flex-col">
        {children}
      </main>
      <footer className="mt-20 py-8 border-t border-slate-100 w-full text-center">
        <p className="text-slate-400 text-sm italic">
          Thinking with you, not for you.
        </p>
      </footer>
    </div>
  );
};
