from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional

from backend.src.models.weather import CurrentWeather, WeatherForecast, GeoLocation, AirQuality
from backend.src.services.weather_service import WeatherService
from backend.src.api.dependencies import get_weather_service
from backend.src.models.user import User
from backend.src.auth.dependencies import get_current_active_user

router = APIRouter(
    prefix="/weather",
    tags=["weather"],
    responses={404: {"description": "Not found"}},
)

@router.get("/current", response_model=CurrentWeather)
async def get_current_weather(
    city: Optional[str] = None,
    lat: Optional[float] = Query(None, ge=-90, le=90),
    lon: Optional[float] = Query(None, ge=-180, le=180),
    weather_service: WeatherService = Depends(get_weather_service)
):
    """
    Get current weather for a location.
    Provide either city name or latitude/longitude coordinates.
    """
    try:
        if city:
            return await weather_service.get_current_weather_by_city(city)
        elif lat is not None and lon is not None:
            return await weather_service.get_current_weather_by_coordinates(lat, lon)
        else:
            raise HTTPException(
                status_code=400, 
                detail="Must provide either city name or latitude/longitude"
            )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")


@router.get("/forecast", response_model=WeatherForecast)
async def get_weather_forecast(
    city: str,
    weather_service: WeatherService = Depends(get_weather_service),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get 5-day weather forecast for a location.
    Provide the city name.
    Requires authentication. 
    """
    try:
        return await weather_service.get_forecast_by_city(city)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast data: {str(e)}")


@router.get("/geocode", response_model=GeoLocation)
async def geocode_city(
    city: str,
    weather_service: WeatherService = Depends(get_weather_service)
):
    """
    Convert city name to geographical coordinates.
    """
    try:
        return await weather_service.provider.geocode(city)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error geocoding city: {str(e)}")


@router.get("/air-quality", response_model=AirQuality)
async def get_air_quality(
    city: Optional[str] = None,
    lat: Optional[float] = Query(None, ge=-90, le=90),
    lon: Optional[float] = Query(None, ge=-180, le=180),
    weather_service: WeatherService = Depends(get_weather_service)
):
    """
    Get air quality data for a location.
    Provide either city name or latitude/longitude coordinates.
    """
    try:
        if city:
            return await weather_service.get_air_quality_by_city(city)
        elif lat is not None and lon is not None:
            return await weather_service.get_air_quality_by_coordinates(lat, lon)
        else:
            raise HTTPException(
                status_code=400, 
                detail="Must provide either city name or latitude/longitude"
            )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching air quality data: {str(e)}") 
