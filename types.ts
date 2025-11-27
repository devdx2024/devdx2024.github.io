export interface WeatherData {
  temp: string;
  condition: string;
  rainChance: string;
  location: string;
  lastUpdated: Date;
}

export interface NewsItem {
  headline: string;
  source: string;
}

export enum WeatherType {
  SUNNY = 'Sunny',
  CLOUDY = 'Cloudy',
  RAINY = 'Rainy',
  STORM = 'Storm',
  UNKNOWN = 'Unknown'
}