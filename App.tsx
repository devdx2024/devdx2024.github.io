import React from 'react';
import Clock from './components/Clock';
import WeatherWidget from './components/WeatherWidget';
import NewsTicker from './components/NewsTicker';

const App: React.FC = () => {
  return (
    <main className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center p-6 md:p-12 font-mono text-green-500">
        
        {/* CRT Scanline Effect Overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20"></div>
        
        {/* Vignette */}
        <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]"></div>

        {/* Animated Background Grid */}
        <div className="absolute inset-0 z-0 opacity-20 perspective-grid"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] -z-10"></div>

        {/* Floating Matrix-like Hex Data (Decorative) */}
        <div className="absolute top-10 right-10 text-[10px] text-green-900/40 hidden md:block select-none">
            0x45 0x4D 0x42 0x55<br/>
            0x46 0x4C 0x4F 0x57<br/>
            SYSTEM_READY...
        </div>

        <div className="w-full max-w-7xl h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Column: Clock and Weather */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
                <div className="pt-8 pl-4 border-l border-green-900/30">
                    <Clock />
                </div>
                
                <div className="pb-8 pl-4">
                     <WeatherWidget />
                </div>
            </div>

            {/* Right Column: News and System Status */}
            <div className="lg:col-span-5 flex flex-col justify-end h-full relative">
                <NewsTicker />
            </div>
        </div>
    </main>
  );
};

export default App;