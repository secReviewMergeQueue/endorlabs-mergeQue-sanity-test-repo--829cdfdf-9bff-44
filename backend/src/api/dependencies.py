import os
from functools import lru_cache

from backend.src.services.weather_service import WeatherService, OpenWeatherMapProvider


@lru_cache()
def get_weather_service() -> WeatherService:
    """
    Dependency that provides a WeatherService instance.
    Uses LRU cache to avoid creating multiple instances.
    """
    api_key = os.getenv("OPENWEATHERMAP_API_KEY")
    provider = OpenWeatherMapProvider(api_key=api_key)
    return WeatherService(provider=provider) 