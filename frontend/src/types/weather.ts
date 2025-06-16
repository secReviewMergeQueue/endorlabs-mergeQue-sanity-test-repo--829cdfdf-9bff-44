export interface WeatherCondition {
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  conditions: WeatherCondition[];
  city: string;
  country: string;
  timestamp: string;
  lat: number;
  lon: number;
}

export interface ForecastItem {
  date: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  conditions: WeatherCondition[];
  precipitation_chance: number;
  wind_speed: number;
}

export interface WeatherForecast {
  city: string;
  country: string;
  forecast: ForecastItem[];
}

export interface GeoLocation {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
}

export {}; 