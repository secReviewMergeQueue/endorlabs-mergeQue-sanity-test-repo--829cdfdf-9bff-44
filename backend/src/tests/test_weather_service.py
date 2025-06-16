import pytest
from datetime import datetime
from unittest.mock import AsyncMock, patch

from backend.src.models.weather import (
    CurrentWeather, 
    WeatherForecast, 
    WeatherCondition,
    ForecastItem,
    GeoLocation
)
from backend.src.services.weather_service import WeatherProvider, WeatherService


# Mock weather provider for testing
class MockWeatherProvider(WeatherProvider):
    async def get_current_weather(self, location: GeoLocation) -> CurrentWeather:
        return CurrentWeather(
            temperature=20.5,
            feels_like=19.8,
            humidity=65,
            pressure=1013,
            wind_speed=5.1,
            wind_direction=270,
            conditions=[
                WeatherCondition(
                    main="Clear",
                    description="clear sky",
                    icon="01d"
                )
            ],
            city="Test City",
            country="TC",
            timestamp=datetime.now()
        )
    
    async def get_forecast(self, location: GeoLocation) -> WeatherForecast:
        return WeatherForecast(
            city="Test City",
            country="TC",
            forecast=[
                ForecastItem(
                    date=datetime.now(),
                    temp_min=18.5,
                    temp_max=25.3,
                    humidity=70,
                    conditions=[
                        WeatherCondition(
                            main="Clear",
                            description="clear sky",
                            icon="01d"
                        )
                    ],
                    precipitation_chance=10.0,
                    wind_speed=4.3
                )
            ]
        )
    
    async def geocode(self, city_name: str) -> GeoLocation:
        if city_name.lower() == "test city":
            return GeoLocation(
                lat=35.12,
                lon=-106.59,
                city="Test City",
                country="TC"
            )
        raise ValueError(f"City not found: {city_name}")


@pytest.fixture
def weather_service():
    provider = MockWeatherProvider()
    return WeatherService(provider=provider)


@pytest.mark.asyncio
async def test_get_current_weather_by_city(weather_service):
    # Arrange
    city = "Test City"
    
    # Act
    result = await weather_service.get_current_weather_by_city(city)
    
    # Assert
    assert isinstance(result, CurrentWeather)
    assert result.city == "Test City"
    assert result.temperature == 20.5


@pytest.mark.asyncio
async def test_get_current_weather_by_coordinates(weather_service):
    # Arrange
    lat, lon = 35.12, -106.59
    
    # Act
    result = await weather_service.get_current_weather_by_coordinates(lat, lon)
    
    # Assert
    assert isinstance(result, CurrentWeather)
    assert result.city == "Test City"
    assert result.temperature == 20.5


@pytest.mark.asyncio
async def test_get_forecast_by_city(weather_service):
    # Arrange
    city = "Test City"
    
    # Act
    result = await weather_service.get_forecast_by_city(city)
    
    # Assert
    assert isinstance(result, WeatherForecast)
    assert result.city == "Test City"
    assert len(result.forecast) == 1
    assert result.forecast[0].temp_max == 25.3


@pytest.mark.asyncio
async def test_city_not_found(weather_service):
    # Arrange
    city = "Nonexistent City"
    
    # Act & Assert
    with pytest.raises(ValueError, match=f"City not found: {city}"):
        await weather_service.get_current_weather_by_city(city)
