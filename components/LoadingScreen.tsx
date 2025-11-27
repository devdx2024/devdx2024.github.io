import React from 'react';

interface LoadingScreenProps {
  progress: number;
  status: string;
  onCancel: () => void;
  isCancelled: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, status, onCancel, isCancelled }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-md p-6">
      {/* Icon / Logo Area */}
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 opacity-75 blur animate-pulse"></div>
        <div className="relative bg-slate-800 rounded-full p-6 border border-slate-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          {isCancelled ? 'Redirecionamento Pausado' : 'Conectando ao Servidor'}
        </h1>
        <p className="text-slate-400 text-sm font-mono">
          {isCancelled ? 'Aguardando ação do usuário' : status}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full transition-all duration-300 ease-out ${isCancelled ? 'bg-amber-500' : 'bg-cyan-500'}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Controls */}
      {!isCancelled ? (
         <button 
         onClick={onCancel}
         className="text-sm text-slate-500 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
       >
         Cancelar Automático
       </button>
      ) : (
        <div className="p-4 bg-amber-900/20 border border-amber-900/50 rounded-lg text-amber-200 text-sm">
            O redirecionamento automático foi cancelado.
        </div>
      )}
     
    </div>
  );
};