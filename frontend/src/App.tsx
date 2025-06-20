import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { weatherApi } from './services/api';
import { authService } from './services/auth';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import WeatherMap from './components/WeatherMap';
import Login from './components/Login';
import { CurrentWeather, WeatherForecast, GeoLocation } from './types/weather';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: var(--primary-color);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const HeaderContent = styled.div`
  text-align: center;
  flex-grow: 1;
`;

const AuthButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Username = styled.span`
  font-weight: bold;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LockedMessage = styled.span`
  font-size: 0.875rem;
  color: var(--danger-color);
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  
  // Check if user is already authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        try {
          const user = await authService.getCurrentUser();
          setUsername(user.username);
        } catch (error) {
          console.error('Failed to get user info:', error);
          authService.logout();
          setIsAuthenticated(false);
        }
      }
    };
    
    checkAuth();
  }, []);
  
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
    isLoading: isLoadingForecast,
    error: forecastError
  } = useQuery(
    ['forecast', searchCity],
    () => {
      if (searchCity) {
        return weatherApi.getForecastByCity(searchCity);
      }
      return null;
    },
    { 
      enabled: !!searchCity && isAuthenticated,
      retry: (failureCount, error: any) => {
        // Don't retry on 401 (unauthorized)
        if (error?.response?.status === 401) return false;
        return failureCount < 3;
      }
    }
  );
  
  const handleSearch = (city: string) => {
    setSearchCity(city);
    setSelectedLocation(null);
  };
  
  const handleMapLocationSelected = (location: GeoLocation) => {
    setSelectedLocation(location);
    setSearchCity('');
  };
  
  const handleLogin = () => {
    setShowLogin(true);
  };
  
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsername(null);
  };
  
  const handleLoginSuccess = async () => {
    setShowLogin(false);
    setIsAuthenticated(true);
    
    try {
      const user = await authService.getCurrentUser();
      setUsername(user.username);
    } catch (error) {
      console.error('Failed to get user info:', error);
    }
  };

  const isLoading = isLoadingWeather || isLoadingForecast;
  const hasError = weatherError !== null;
  const hasForecastError = forecastError !== null && !isAuthenticated;
  const hasData = currentWeather !== null && !isLoading && !hasError;
  
  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <Title>Weather App</Title>
          <Subtitle>Get current weather and forecasts for any location</Subtitle>
        </HeaderContent>
        
        {isAuthenticated ? (
          <UserInfo>
            <Username>Welcome, {username}</Username>
            <AuthButton onClick={handleLogout}>Logout</AuthButton>
          </UserInfo>
        ) : (
          <AuthButton onClick={handleLogin}>Login</AuthButton>
        )}
      </Header>
      
      {showLogin ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
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
          
          <Section>
            <SectionTitle>
              5-Day Forecast
              {!isAuthenticated && <LockedMessage>Login required for forecast data</LockedMessage>}
            </SectionTitle>
            
            {!isAuthenticated ? (
              <ErrorMessage>Please login to access forecast data</ErrorMessage>
            ) : hasData && forecast ? (
              <ForecastContainer>
                {forecast.forecast.map((item, index) => (
                  <ForecastCard key={index} forecast={item} />
                ))}
              </ForecastContainer>
            ) : null}
          </Section>
          
          {isLoading && <LoadingMessage>Loading weather data...</LoadingMessage>}
          
          {hasError && (
            <ErrorMessage>
              Error fetching weather data. Please check the city name and try again.
            </ErrorMessage>
          )}
          
          {hasForecastError && isAuthenticated && (
            <ErrorMessage>
              Error fetching forecast data. Please try again later.
            </ErrorMessage>
          )}
        </>
      )}
    </AppContainer>
  );
};

export default App;
