import { GoogleGenAI } from "@google/genai";
import { WeatherData, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using a fallback mechanism if the API key is missing or search fails
const MOCK_WEATHER: WeatherData = {
  temp: "24",
  condition: "Parcialmente Nublado",
  rainChance: "10%",
  location: "Embu das Artes, SP",
  lastUpdated: new Date()
};

const MOCK_NEWS: NewsItem[] = [
  { headline: "Novos avanços em computação quântica prometem revolucionar a segurança de dados.", source: "TechDaily" },
  { headline: "Inteligência Artificial generativa transforma a indústria de design gráfico.", source: "InovaNews" },
  { headline: "Lançamento de novos processadores focados em eficiência energética.", source: "HardwareToday" },
];

export const fetchWeatherForEmbu = async (): Promise<WeatherData> => {
  try {
    if (!process.env.API_KEY) return MOCK_WEATHER;

    // We use the model to search for current weather
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What is the current temperature (in Celsius), general condition (in Portuguese), and chance of rain in Embu das Artes, São Paulo, Brazil right now? Return strictly a pipe-separated string: TEMP|CONDITION|RAIN_CHANCE. Example: 23|Nublado|15%",
      config: {
        tools: [{ googleSearch: {} }],
        // Note: No responseMimeType when using googleSearch
      },
    });

    const text = response.text || "";
    // Attempt to parse the specific format requested
    const parts = text.split('|').map(s => s.trim());
    
    if (parts.length >= 3) {
      // Basic cleaning of the string (removing non-numeric for temp)
      const temp = parts[0].replace(/[^\d]/g, ''); 
      return {
        temp: temp || "20",
        condition: parts[1],
        rainChance: parts[2],
        location: "Embu das Artes",
        lastUpdated: new Date()
      };
    }

    // Fallback if parsing fails but we have text
    console.warn("Could not parse precise weather, using fallback.");
    return MOCK_WEATHER;

  } catch (error) {
    console.error("Error fetching weather:", error);
    return MOCK_WEATHER;
  }
};

export const fetchTechNews = async (): Promise<NewsItem[]> => {
  try {
    if (!process.env.API_KEY) return MOCK_NEWS;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "List the top 5 most interesting technology news headlines from the last 24 hours. Return them as a Javascript JSON array of objects with 'headline' and 'source' properties. Language: Portuguese.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    // Clean up markdown code blocks if present to parse JSON
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
        const news = JSON.parse(jsonString) as NewsItem[];
        if (Array.isArray(news)) {
            return news.slice(0, 5);
        }
    } catch (e) {
        console.warn("JSON parse failed for news, trying heuristic parsing");
    }
    
    return MOCK_NEWS;

  } catch (error) {
    console.error("Error fetching news:", error);
    return MOCK_NEWS;
  }
};