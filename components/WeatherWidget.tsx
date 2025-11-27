import React, { useEffect, useState } from 'react';
import { WeatherData } from '../types';
import { fetchWeatherForEmbu } from '../services/geminiService';
import { SunIcon, CloudIcon, RainIcon, ThermometerIcon } from './Icons';

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      setLoading(true);
      const data = await fetchWeatherForEmbu();
      setWeather(data);
      setLoading(false);
    };

    loadWeather();
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
        <div className="h-32 w-64 border border-green-900 bg-black/50 p-4 rounded-sm">
            <div className="animate-pulse text-green-900 font-mono text-xs">LOADING ENV_DATA...</div>
        </div>
    );
  }

  if (!weather) return null;

  const getIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('chuva') || c.includes('rain')) return <RainIcon className="w-12 h-12 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />;
    if (c.includes('sol') || c.includes('claro') || c.includes('sunny') || c.includes('limpo')) return <SunIcon className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />;
    return <CloudIcon className="w-12 h-12 text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.6)]" />;
  };

  return (
    <div className="relative group max-w-md">
        {/* Terminal Header */}
        <div className="bg-green-900/20 border-t border-x border-green-800/50 p-1 flex justify-between items-center rounded-t-sm">
            <span className="text-[10px] text-green-600 pl-2">ENV_MONITOR.EXE</span>
            <div className="flex gap-1 pr-1">
                <div className="w-2 h-2 rounded-full bg-green-800"></div>
                <div className="w-2 h-2 rounded-full bg-green-800"></div>
            </div>
        </div>

        {/* Content Box */}
        <div className="flex items-center space-x-6 bg-black/80 backdrop-blur-sm p-6 border border-green-800/50 rounded-b-sm shadow-[0_0_15px_rgba(0,255,0,0.05)] relative overflow-hidden">
            
            {/* Scanline decoration inside widget */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,255,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>

            <div className="flex-shrink-0 z-10 opacity-90">
                {getIcon(weather.condition)}
            </div>
            
            <div className="flex flex-col z-10">
                <div className="text-5xl font-bold text-green-400 flex items-start tracking-tighter drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]">
                    {weather.temp}
                    <span className="text-sm mt-1 ml-1 text-green-700">°C</span>
                </div>
                
                <div className="flex flex-col mt-2 border-l border-green-900 pl-3">
                    <span className="text-lg text-green-200 uppercase tracking-widest text-[0.8rem]">{weather.condition}</span>
                    <span className="text-xs text-green-600 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        PRECIP_PROB: {weather.rainChance}
                    </span>
                    <span className="text-[10px] text-green-800 mt-1 uppercase">LOC: {weather.location}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default WeatherWidget;