import axios from 'axios';
import { CurrentWeather, WeatherForecast, GeoLocation } from '../types/weather';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:8000';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const weatherApi = {
  /**
   * Get current weather by city name
   */
  getCurrentWeatherByCity: async (city: string): Promise<CurrentWeather> => {
    const response = await api.get<CurrentWeather>('/weather/current', {
      params: { city },
    });
    return response.data;
  },

  /**
   * Get current weather by coordinates
   */
  getCurrentWeatherByCoordinates: async (lat: number, lon: number): Promise<CurrentWeather> => {
    const response = await api.get<CurrentWeather>('/weather/current', {
      params: { lat, lon },
    });
    return response.data;
  },

  /**
   * Get 5-day forecast by city name
   */
  getForecastByCity: async (city: string): Promise<WeatherForecast> => {
    const response = await api.get<WeatherForecast>('/weather/forecast', {
      params: { city },
    });
    return response.data;
  },

  /**
   * Geocode a city name to coordinates
   */
  geocodeCity: async (city: string): Promise<GeoLocation> => {
    const response = await api.get<GeoLocation>('/weather/geocode', {
      params: { city },
    });
    return response.data;
  },
};
