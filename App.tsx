import React, { useState, useEffect, useCallback } from 'react';
import { usePWAInstall } from './hooks/usePWAInstall';
import { LoadingScreen } from './components/LoadingScreen';

// Configuration
const TARGET_URL = 'https://192.168.0.14';
const REDIRECT_DELAY_MS = 3500; // 3.5 seconds
const UPDATE_INTERVAL_MS = 50;

const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [isCancelled, setIsCancelled] = useState(false);
  const { supportsPWA, install } = usePWAInstall();

  // Handle the redirect logic
  const performRedirect = useCallback(() => {
    window.location.href = TARGET_URL;
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isRedirecting || isCancelled) return;

    const startTime = Date.now();
    const endTime = startTime + REDIRECT_DELAY_MS;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const elapsed = REDIRECT_DELAY_MS - remaining;
      const newProgress = Math.min(100, (elapsed / REDIRECT_DELAY_MS) * 100);

      setProgress(newProgress);

      if (now >= endTime) {
        clearInterval(interval);
        performRedirect();
      }
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isRedirecting, isCancelled, performRedirect]);

  const handleCancel = () => {
    setIsCancelled(true);
    setIsRedirecting(false);
    setProgress(100);
  };

  const handleManualRedirect = () => {
    performRedirect();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        
        <LoadingScreen 
          progress={progress} 
          status={isCancelled ? 'Cancelado' : `Abrindo ${TARGET_URL}...`}
          onCancel={handleCancel}
          isCancelled={isCancelled}
        />

        {/* Action Area */}
        <div className="bg-slate-900/50 p-6 border-t border-slate-700/50 flex flex-col gap-3">
          
          <button
            onClick={handleManualRedirect}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <span>Acessar Agora</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {supportsPWA && (
             <button
             onClick={install}
             className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-3 px-6 rounded-lg transition-all active:scale-95"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
             <span>Instalar App</span>
           </button>
          )}

          <div className="text-center mt-2">
            <span className="text-xs text-slate-500">
              Destino: <span className="font-mono text-slate-400">{TARGET_URL}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;