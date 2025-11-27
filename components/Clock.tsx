import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Cursor blinking effect
    const blinker = setInterval(() => {
        setBlink(prev => !prev);
    }, 500);

    return () => {
        clearInterval(timer);
        clearInterval(blinker);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="flex flex-col select-none group">
      <div className="flex items-baseline">
        <span className="text-sm text-green-700 mr-4 font-bold tracking-widest">{`root@embu-node:~$ date`}</span>
      </div>
      
      <div className="text-[9rem] md:text-[11rem] leading-none font-bold tracking-tighter text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
        {formatTime(time)}<span className={`${blink ? 'opacity-100' : 'opacity-0'} text-green-500`}>_</span>
      </div>
      
      <div className="text-xl md:text-2xl font-normal pl-2 uppercase tracking-[0.2em] text-green-800 border-l-2 border-green-900 pl-4 ml-2">
        {formatDate(time)}
      </div>
    </div>
  );
};

export default Clock;