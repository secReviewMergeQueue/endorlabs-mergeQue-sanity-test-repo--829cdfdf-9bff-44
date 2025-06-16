from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime


class WeatherCondition(BaseModel):
    """Model for current weather conditions."""
    description: str
    icon: str
    main: str


class CurrentWeather(BaseModel):
    """Model for current weather data."""
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_direction: int
    conditions: List[WeatherCondition]
    city: str
    country: str
    timestamp: datetime


class ForecastItem(BaseModel):
    """Model for a single forecast item."""
    date: datetime
    temp_min: float
    temp_max: float
    humidity: int
    conditions: List[WeatherCondition]
    precipitation_chance: float
    wind_speed: float


class WeatherForecast(BaseModel):
    """Model for 5-day weather forecast."""
    city: str
    country: str
    forecast: List[ForecastItem]


class GeoLocation(BaseModel):
    """Model for geographical location."""
    lat: float
    lon: float
    city: Optional[str] = None
    country: Optional[str] = None


class AirQuality(BaseModel):
    """Model for air quality data."""
    aqi: int  # Air Quality Index (1-5)
    description: str  # Description of the air quality level
    pollutants: Dict[str, float]  # Concentration of various pollutants
    city: str
    country: str
    timestamp: datetime 