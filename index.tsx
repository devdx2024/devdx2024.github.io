import { fetchWeatherForEmbu } from './services/geminiService';
import { SVGIcons } from './components/Icons';

// --- Types ---
interface DOMState {
  time: HTMLElement | null;
  date: HTMLElement | null;
  weatherContainer: HTMLElement | null;
  weatherTemp: HTMLElement | null;
  weatherCond: HTMLElement | null;
  weatherRain: HTMLElement | null;
  weatherIcon: HTMLElement | null;
}

// --- State ---
let dom: DOMState = {
  time: null,
  date: null,
  weatherContainer: null,
  weatherTemp: null,
  weatherCond: null,
  weatherRain: null,
  weatherIcon: null
};

// --- Clock Logic ---
function updateClock() {
  if (!dom.time || !dom.date) return;
  
  const now = new Date();
  
  // Time HH:MM
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Custom cursor logic
  const cursorHtml = `<span class="cursor-blink text-green-500">_</span>`;
  dom.time.innerHTML = `${timeStr}${cursorHtml}`;

  // Date
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  dom.date.textContent = dateStr;
}

// --- Weather Logic ---
async function updateWeather() {
  if (!dom.weatherTemp) return;

  try {
      const data = await fetchWeatherForEmbu();
      if (!data) return;

      if (dom.weatherTemp) dom.weatherTemp.textContent = data.temp;
      if (dom.weatherCond) dom.weatherCond.textContent = data.condition;
      if (dom.weatherRain) dom.weatherRain.textContent = data.rainChance;

      // Icon Selection
      if (dom.weatherIcon) {
        const c = data.condition.toLowerCase();
        let iconHtml = SVGIcons.Cloud;
        if (c.includes('chuva') || c.includes('rain') || c.includes('tempestade')) iconHtml = SVGIcons.Rain;
        else if (c.includes('sol') || c.includes('claro') || c.includes('limpo')) iconHtml = SVGIcons.Sun;
        
        dom.weatherIcon.innerHTML = iconHtml;
      }
      
      // Fade in animation
      if (dom.weatherContainer) {
        dom.weatherContainer.style.opacity = '1';
      }

  } catch (e) {
      console.error("Weather Update Failed", e);
  }
}

// --- Initialization ---
function init() {
    console.log("System initializing...");

    // 1. Grab DOM Elements safely
    dom = {
      time: document.getElementById('clock-time'),
      date: document.getElementById('clock-date'),
      weatherContainer: document.getElementById('weather-container'),
      weatherTemp: document.getElementById('weather-temp'),
      weatherCond: document.getElementById('weather-condition'),
      weatherRain: document.getElementById('weather-rain'),
      weatherIcon: document.getElementById('weather-icon'),
    };

    // Check if critical elements exist
    if (!dom.time) {
        console.error("Critical Error: Clock element not found.");
        return;
    }

    // 2. Start Clock immediately
    updateClock();
    setInterval(updateClock, 1000);

    // 3. Start Weather
    updateWeather();
    setInterval(updateWeather, 30 * 60 * 1000); // 30 mins
}

// Ensure DOM is ready before running init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}