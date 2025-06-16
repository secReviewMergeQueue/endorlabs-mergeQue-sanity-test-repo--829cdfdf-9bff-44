import os
import requests
from datetime import datetime
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod

from backend.src.models.weather import (
    CurrentWeather, 
    WeatherForecast, 
    WeatherCondition,
    ForecastItem,
    GeoLocation,
    AirQuality
)


class WeatherProvider(ABC):
    """Abstract base class for weather providers"""
    
    @abstractmethod
    async def get_current_weather(self, location: GeoLocation) -> CurrentWeather:
        """Get current weather for a location"""
        pass
    
    @abstractmethod
    async def get_forecast(self, location: GeoLocation) -> WeatherForecast:
        """Get weather forecast for a location"""
        pass
    
    @abstractmethod
    async def geocode(self, city_name: str) -> GeoLocation:
        """Convert city name to coordinates"""
        pass

    @abstractmethod
    async def get_air_quality(self, location: GeoLocation) -> AirQuality:
        """Get air quality data for a location"""
        pass


class OpenWeatherMapProvider(WeatherProvider):
    """Implementation of WeatherProvider using OpenWeatherMap API"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENWEATHERMAP_API_KEY")
        if not self.api_key:
            raise ValueError("OpenWeatherMap API key is required")
        
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.geo_url = "https://api.openweathermap.org/geo/1.0"
    
    async def get_current_weather(self, location: GeoLocation) -> CurrentWeather:
        """Get current weather for a location using OpenWeatherMap API"""
        params = {
            "lat": location.lat,
            "lon": location.lon,
            "appid": self.api_key,
            "units": "metric"
        }
        
        response = requests.get(f"{self.base_url}/weather", params=params)
        response.raise_for_status()
        data = response.json()
        
        conditions = [
            WeatherCondition(
                main=weather["main"],
                description=weather["description"],
                icon=weather["icon"]
            )
            for weather in data["weather"]
        ]
        
        return CurrentWeather(
            temperature=data["main"]["temp"],
            feels_like=data["main"]["feels_like"],
            humidity=data["main"]["humidity"],
            pressure=data["main"]["pressure"],
            wind_speed=data["wind"]["speed"],
            wind_direction=data["wind"]["deg"],
            conditions=conditions,
            city=data["name"],
            country=data["sys"]["country"],
            timestamp=datetime.fromtimestamp(data["dt"])
        )
    
    async def get_forecast(self, location: GeoLocation) -> WeatherForecast:
        """Get 5-day weather forecast for a location using OpenWeatherMap API"""
        params = {
            "lat": location.lat,
            "lon": location.lon,
            "appid": self.api_key,
            "units": "metric"
        }
        
        response = requests.get(f"{self.base_url}/forecast", params=params)
        response.raise_for_status()
        data = response.json()
        
        # Group forecast by day
        daily_forecasts = {}
        
        for item in data["list"]:
            dt = datetime.fromtimestamp(item["dt"])
            day_key = dt.date().isoformat()
            
            conditions = [
                WeatherCondition(
                    main=weather["main"],
                    description=weather["description"],
                    icon=weather["icon"]
                )
                for weather in item["weather"]
            ]
            
            if day_key not in daily_forecasts:
                daily_forecasts[day_key] = {
                    "date": dt,
                    "temp_min": item["main"]["temp_min"],
                    "temp_max": item["main"]["temp_max"],
                    "conditions": conditions,
                    "humidity": item["main"]["humidity"],
                    "precipitation_chance": item.get("pop", 0) * 100,  # Convert to percentage
                    "wind_speed": item["wind"]["speed"]
                }
            else:
                # Update min/max temperatures if needed
                daily_forecasts[day_key]["temp_min"] = min(
                    daily_forecasts[day_key]["temp_min"], 
                    item["main"]["temp_min"]
                )
                daily_forecasts[day_key]["temp_max"] = max(
                    daily_forecasts[day_key]["temp_max"], 
                    item["main"]["temp_max"]
                )
        
        forecast_items = [ForecastItem(**forecast) for forecast in daily_forecasts.values()]
        
        return WeatherForecast(
            city=data["city"]["name"],
            country=data["city"]["country"],
            forecast=forecast_items
        )
    
    async def geocode(self, city_name: str) -> GeoLocation:
        """Convert city name to coordinates using OpenWeatherMap Geocoding API"""
        params = {
            "q": city_name,
            "limit": 1,
            "appid": self.api_key
        }
        
        response = requests.get(f"{self.geo_url}/direct", params=params)
        response.raise_for_status()
        data = response.json()
        
        if not data:
            raise ValueError(f"City not found: {city_name}")
        
        return GeoLocation(
            lat=data[0]["lat"],
            lon=data[0]["lon"],
            city=data[0]["name"],
            country=data[0].get("country")
        )

    async def get_air_quality(self, location: GeoLocation) -> AirQuality:
        """Get air quality data for a location using OpenWeatherMap API"""
        params = {
            "lat": location.lat,
            "lon": location.lon,
            "appid": self.api_key
        }
        
        response = requests.get(f"{self.base_url}/air_pollution", params=params)
        response.raise_for_status()
        data = response.json()
        
        # Map AQI values to descriptions
        aqi_descriptions = {
            1: "Good",
            2: "Fair",
            3: "Moderate",
            4: "Poor",
            5: "Very Poor"
        }
        
        # Extract pollutant concentrations
        pollutants = {
            "co": data["list"][0]["components"]["co"],  # Carbon monoxide
            "no2": data["list"][0]["components"]["no2"],  # Nitrogen dioxide
            "o3": data["list"][0]["components"]["o3"],  # Ozone
            "pm2_5": data["list"][0]["components"]["pm2_5"],  # Fine particles
            "pm10": data["list"][0]["components"]["pm10"],  # Coarse particles
            "so2": data["list"][0]["components"]["so2"]  # Sulfur dioxide
        }
        
        return AirQuality(
            aqi=data["list"][0]["main"]["aqi"],
            description=aqi_descriptions.get(data["list"][0]["main"]["aqi"], "Unknown"),
            pollutants=pollutants,
            city=location.city or "Unknown",
            country=location.country or "Unknown",
            timestamp=datetime.fromtimestamp(data["list"][0]["dt"])
        )


class WeatherService:
    """Service for retrieving weather information"""
    
    def __init__(self, provider: WeatherProvider):
        self.provider = provider
    
    async def get_current_weather_by_city(self, city: str) -> CurrentWeather:
        """Get current weather for a city"""
        location = await self.provider.geocode(city)
        return await self.provider.get_current_weather(location)
    
    async def get_current_weather_by_coordinates(self, lat: float, lon: float) -> CurrentWeather:
        """Get current weather for coordinates"""
        location = GeoLocation(lat=lat, lon=lon)
        return await self.provider.get_current_weather(location)
    
    async def get_forecast_by_city(self, city: str) -> WeatherForecast:
        """Get weather forecast for a city"""
        location = await self.provider.geocode(city)
        return await self.provider.get_forecast(location)

    async def get_air_quality_by_city(self, city: str) -> AirQuality:
        """Get air quality data for a city"""
        location = await self.provider.geocode(city)
        return await self.provider.get_air_quality(location)
    
    async def get_air_quality_by_coordinates(self, lat: float, lon: float) -> AirQuality:
        """Get air quality data for coordinates"""
        location = GeoLocation(lat=lat, lon=lon)
        return await self.provider.get_air_quality(location)
