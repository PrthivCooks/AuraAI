
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputLayer } from './components/InputLayer';
import { ReasoningView } from './components/ReasoningView';
import { AppState, CoPilotAnalysis } from './types';
import { analyzeIngredients } from './geminiService';

const LoadingState = ({ message }: { message?: string }) => (
  <div className="flex-grow flex flex-col items-center justify-center space-y-8 py-20 animate-pulse">
    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-indigo-600 animate-[ping_2s_ease-in-out_infinite] opacity-20"></div>
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-2xl serif italic text-slate-400">{message || "Consulting Aura..."}</h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto">
        Inferring your concerns, analyzing scientific nuances, and balancing uncertainty.
      </p>
    </div>
  </div>
);

const ErrorView = ({ message, onReset }: { message: string, onReset: () => void }) => (
  <div className="flex-grow flex flex-col items-center justify-center space-y-6 text-center py-20">
    <div className="text-rose-500 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <h2 className="text-2xl font-semibold">Something clouded our view</h2>
    <p className="text-slate-500 max-w-md">{message}</p>
    <button 
      onClick={onReset}
      className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
    >
      Try Again
    </button>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'landing',
    inputData: {},
    isLoading: false
  });

  const handleInput = async (data: { text?: string; image?: string; additionalContext?: string }) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      view: prev.view === 'reasoning' ? 'reasoning' : 'scanning',
      inputData: { ...prev.inputData, ...data }
    }));
    
    try {
      const result = await analyzeIngredients({ ...state.inputData, ...data });
      setState(prev => ({
        view: 'reasoning',
        inputData: { ...prev.inputData, ...data },
        analysis: result,
        isLoading: false
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        view: 'error',
        isLoading: false,
        error: error.message || "Something went wrong."
      }));
    }
  };

  const handleRefine = (answer: string) => {
    handleInput({ additionalContext: answer });
  };

  const reset = () => {
    setState({
      view: 'landing',
      inputData: {},
      isLoading: false
    });
  };

  return (
    <Layout>
      {state.isLoading && state.view !== 'reasoning' ? (
        <LoadingState />
      ) : (
        <>
          {state.view === 'landing' && (
            <InputLayer onInput={handleInput} isLoading={state.isLoading} />
          )}
          
          {state.view === 'reasoning' && state.analysis && (
            <ReasoningView 
              analysis={state.analysis} 
              onReset={reset} 
              onRefine={handleRefine}
              isRefining={state.isLoading}
            />
          )}

          {state.view === 'error' && (
            <ErrorView message={state.error || ''} onReset={reset} />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
