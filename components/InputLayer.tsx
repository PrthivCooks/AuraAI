
import React, { useRef } from 'react';

interface InputLayerProps {
  onInput: (data: { text?: string; image?: string }) => void;
  isLoading: boolean;
}

export const InputLayer: React.FC<InputLayerProps> = ({ onInput, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = React.useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onInput({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 w-full animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h2 className="text-4xl serif leading-tight">What are we looking at today?</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Labels are for regulators. I'm here for you. Share a photo or a list of ingredients.
        </p>
      </div>

      <div className="grid gap-4 mt-8">
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="group relative overflow-hidden bg-white border-2 border-indigo-100 p-8 rounded-3xl flex flex-col items-center gap-4 transition-all hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 active:scale-[0.98] disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-xl font-medium">Scan Label</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />
        </button>

        <div className="relative">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type ingredients here..."
            className="w-full p-6 bg-white border-2 border-slate-100 rounded-3xl min-h-[160px] focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 resize-none shadow-sm"
          />
          {textInput.length > 5 && (
            <button 
              onClick={() => onInput({ text: textInput })}
              disabled={isLoading}
              className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
            >
              Reason
            </button>
          )}
        </div>
      </div>

      <div className="pt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Intent Inference</p>
           <p className="text-sm text-slate-600">I'll try to understand if this is for your child, your gym goals, or general wellness.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
           <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Scientific Nuance</p>
           <p className="text-sm text-slate-600">No red/green scores. Just the "why" behind every tradeoff.</p>
        </div>
      </div>
    </div>
  );
};
