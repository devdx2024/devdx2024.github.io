import React, { useEffect, useState } from 'react';
import { NewsItem } from '../types';
import { fetchTechNews } from '../services/geminiService';

const NewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typingEffect, setTypingEffect] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchTechNews();
      setNews(data);
    };

    loadNews();
    const interval = setInterval(loadNews, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for headlines
  useEffect(() => {
    if (news.length === 0) return;
    
    const text = news[currentIndex].headline;
    setTypingEffect("");
    let i = 0;
    
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            setTypingEffect(prev => prev + text.charAt(i));
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 30); // Speed of typing

    const slideInterval = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000); // Wait 8 seconds before next slide

    return () => {
        clearInterval(typeInterval);
        clearTimeout(slideInterval);
    };
  }, [currentIndex, news]);

  if (news.length === 0) return null;

  const currentItem = news[currentIndex];

  return (
    <div className="w-full max-w-3xl mt-auto mb-12 font-mono">
      <div className="bg-black border border-green-800/60 p-1 rounded-sm shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        {/* Terminal Toolbar */}
        <div className="bg-green-900/10 px-2 py-1 flex items-center gap-2 mb-2 border-b border-green-900/30">
            <div className="w-2 h-2 rounded-full bg-red-900"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-900"></div>
            <div className="w-2 h-2 rounded-full bg-green-900"></div>
            <span className="ml-2 text-[10px] text-green-700 uppercase tracking-widest">/var/log/tech_news.txt</span>
        </div>

        <div className="p-4 min-h-[140px] flex flex-col justify-between relative">
             <div className="text-green-500 text-lg md:text-xl leading-relaxed">
                <span className="text-green-800 mr-2">{`>`}</span>
                {typingEffect}
                <span className="inline-block w-2.5 h-5 bg-green-500 ml-1 animate-pulse align-middle"></span>
             </div>

             <div className="mt-4 flex justify-between items-end border-t border-green-900/30 pt-2">
                <span className="text-xs text-green-800 font-bold uppercase">
                    SRC: {currentItem.source}
                </span>
                <span className="text-[10px] text-green-900">
                    PACKET {currentIndex + 1}/{news.length}
                </span>
             </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;