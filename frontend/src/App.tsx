import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { weatherApi } from './services/api';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import WeatherMap from './components/WeatherMap';
import { CurrentWeather, WeatherForecast, GeoLocation } from './types/weather';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: var(--text-color);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ForecastContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  padding: 1rem;
  text-align: center;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
`;

const App: React.FC = () => {
  const [searchCity, setSearchCity] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<GeoLocation | null>(null);
  
  // Use React Query for API calls
  const { 
    data: currentWeather,
    isLoading: isLoadingWeather,
    error: weatherError
  } = useQuery(
    ['currentWeather', searchCity, selectedLocation],
    () => {
      if (searchCity) {
        return weatherApi.getCurrentWeatherByCity(searchCity);
      } else if (selectedLocation) {
        return weatherApi.getCurrentWeatherByCoordinates(
          selectedLocation.lat, 
          selectedLocation.lon
        );
      }
      return null;
    },
    { enabled: !!(searchCity || selectedLocation) }
  );
  
  const { 
    data: forecast,
    isLoading: isLoadingForecast
  } = useQuery(
    ['forecast', searchCity],
    () => {
      if (searchCity) {
        return weatherApi.getForecastByCity(searchCity);
      }
      return null;
    },
    { enabled: !!searchCity }
  );
  
  const handleSearch = (city: string) => {
    setSearchCity(city);
    setSelectedLocation(null);
  };
  
  const handleMapLocationSelected = (location: GeoLocation) => {
    setSelectedLocation(location);
    setSearchCity('');
  };

  const isLoading = isLoadingWeather || isLoadingForecast;
  const hasError = weatherError !== null;
  const hasData = currentWeather !== null && !isLoading && !hasError;
  
  return (
    <AppContainer>
      <Header>
        <Title>Weather App</Title>
        <Subtitle>Get current weather and forecasts for any location</Subtitle>
      </Header>
      
      <Grid>
        <div>
          <Section>
            <SectionTitle>Search for a location</SectionTitle>
            <SearchBar onSearch={handleSearch} />
          </Section>
          
          {hasData && currentWeather && (
            <Section>
              <SectionTitle>Current Weather</SectionTitle>
              <WeatherCard weather={currentWeather as CurrentWeather} />
            </Section>
          )}
        </div>
        
        <div>
          <Section>
            <SectionTitle>Interactive Map</SectionTitle>
            <WeatherMap 
              onLocationSelected={handleMapLocationSelected}
              center={currentWeather ? [currentWeather.lat, currentWeather.lon] : undefined}
            />
          </Section>
        </div>
      </Grid>
      
      {hasData && forecast && (
        <Section>
          <SectionTitle>5-Day Forecast</SectionTitle>
          <ForecastContainer>
            {forecast.forecast.map((item, index) => (
              <ForecastCard key={index} forecast={item} />
            ))}
          </ForecastContainer>
        </Section>
      )}
      
      {isLoading && <LoadingMessage>Loading weather data...</LoadingMessage>}
      
      {hasError && (
        <ErrorMessage>
          Error fetching weather data. Please check the city name and try again.
        </ErrorMessage>
      )}
    </AppContainer>
  );
};

export default App;
