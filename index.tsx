import { fetchWeatherForEmbu, fetchTechNews } from './services/geminiService';
import { SVGIcons } from './components/Icons';
import { WeatherData, NewsItem } from './types';

// --- State ---
let newsData: NewsItem[] = [];
let currentNewsIndex = 0;
let typingInterval: any = null;
let slideTimeout: any = null;

// --- DOM Elements ---
const dom = {
  time: document.getElementById('clock-time')!,
  date: document.getElementById('clock-date')!,
  weatherTemp: document.getElementById('weather-temp')!,
  weatherCond: document.getElementById('weather-condition')!,
  weatherRain: document.getElementById('weather-rain')!,
  weatherIcon: document.getElementById('weather-icon')!,
  newsHeadline: document.getElementById('news-headline')!,
  newsSource: document.getElementById('news-source')!,
  newsIndex: document.getElementById('news-index')!,
};

// --- Clock Logic ---
function updateClock() {
  const now = new Date();
  
  // Time HH:MM
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  // We keep the blinker span in the HTML, so we only update the text node
  if (dom.time.firstChild) {
      dom.time.firstChild.textContent = timeStr;
  }

  // Date
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  dom.date.textContent = dateStr;
}

// --- Weather Logic ---
async function updateWeather() {
  try {
      const data = await fetchWeatherForEmbu();
      if (!data) return;

      dom.weatherTemp.textContent = data.temp;
      dom.weatherCond.textContent = data.condition;
      dom.weatherRain.textContent = data.rainChance;

      // Icon Selection
      const c = data.condition.toLowerCase();
      let iconHtml = SVGIcons.Cloud;
      if (c.includes('chuva') || c.includes('rain')) iconHtml = SVGIcons.Rain;
      else if (c.includes('sol') || c.includes('claro') || c.includes('limpo')) iconHtml = SVGIcons.Sun;
      
      dom.weatherIcon.innerHTML = iconHtml;

  } catch (e) {
      console.error("Weather Update Failed", e);
  }
}

// --- News Logic ---
async function updateNewsData() {
    const news = await fetchTechNews();
    if (news && news.length > 0) {
        newsData = news;
        currentNewsIndex = 0;
        displayNewsItem();
    }
}

function displayNewsItem() {
    if (newsData.length === 0) return;
    
    // Clear previous
    if (typingInterval) clearInterval(typingInterval);
    if (slideTimeout) clearTimeout(slideTimeout);

    const item = newsData[currentNewsIndex];
    dom.newsSource.textContent = `SRC: ${item.source}`;
    dom.newsIndex.textContent = `PACKET ${currentNewsIndex + 1}/${newsData.length}`;
    
    // Typewriter Effect
    dom.newsHeadline.textContent = "";
    const text = item.headline;
    let charIndex = 0;

    typingInterval = setInterval(() => {
        if (charIndex < text.length) {
            dom.newsHeadline.textContent += text.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            // Schedule next slide
            slideTimeout = setTimeout(() => {
                currentNewsIndex = (currentNewsIndex + 1) % newsData.length;
                displayNewsItem();
            }, 8000);
        }
    }, 40); // Typing speed
}

// --- Init ---
function init() {
    // Start Clock
    setInterval(updateClock, 1000);
    updateClock();

    // Initial Fetch
    updateWeather();
    updateNewsData();

    // Polling
    setInterval(updateWeather, 30 * 60 * 1000); // 30 mins
    setInterval(updateNewsData, 60 * 60 * 1000); // 60 mins
}

// Ensure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}