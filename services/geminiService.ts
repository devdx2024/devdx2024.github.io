import { GoogleGenAI } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fallback data
const MOCK_WEATHER: WeatherData = {
  temp: "24",
  condition: "Sistema Online",
  rainChance: "0%",
  location: "Embu das Artes, SP",
  lastUpdated: new Date()
};

export const fetchWeatherForEmbu = async (): Promise<WeatherData> => {
  try {
    if (!process.env.API_KEY) return MOCK_WEATHER;

    // We use the model to search for current weather
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "What is the current temperature (only the number), short weather condition (in Portuguese), and chance of rain (percentage) in Embu das Artes, São Paulo? Output format: TEMP|CONDITION|RAIN_CHANCE. Example: 23|Nublado|10%",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    // Clean up response
    const cleanText = text.trim();
    const parts = cleanText.split('|').map(s => s.trim());
    
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

    console.warn("Weather parse format mismatch, using fallback.");
    return MOCK_WEATHER;

  } catch (error) {
    console.error("Error fetching weather:", error);
    return MOCK_WEATHER;
  }
};
