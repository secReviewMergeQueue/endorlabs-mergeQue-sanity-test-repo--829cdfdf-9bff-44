import React from 'react';
import styled from 'styled-components';
import { CurrentWeather } from '../types/weather';
import { FaThermometerHalf, FaWind, FaTint, FaCompress } from 'react-icons/fa';

interface WeatherCardProps {
  weather: CurrentWeather;
}

const CardContainer = styled.div`
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Location = styled.h2`
  color: var(--text-color);
  margin: 0;
`;

const Temperature = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary-color);
`;

const Conditions = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const ConditionText = styled.span`
  margin-left: 0.5rem;
  color: var(--text-color);
  text-transform: capitalize;
`;

const WeatherIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  color: var(--text-color);
`;

const MetricIcon = styled.div`
  margin-right: 0.5rem;
  color: var(--primary-color);
  display: flex;
  align-items: center;
`;

const MetricValue = styled.span`
  font-weight: 500;
`;

const MetricLabel = styled.span`
  margin-left: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`;

const Timestamp = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #666;
  text-align: right;
`;

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  // Format the timestamp
  const timestamp = new Date(weather.timestamp).toLocaleString();
  
  // Get the first weather condition (there can be multiple)
  const mainCondition = weather.conditions[0];

  return (
    <CardContainer>
      <CardHeader>
        <Location>{weather.city}, {weather.country}</Location>
        <Temperature>{Math.round(weather.temperature)}°C</Temperature>
      </CardHeader>
      
      <Conditions>
        <WeatherIcon 
          src={`https://openweathermap.org/img/wn/${mainCondition.icon}@2x.png`} 
          alt={mainCondition.description} 
        />
        <ConditionText>{mainCondition.description}</ConditionText>
      </Conditions>
      
      <MetricsContainer>
        <Metric>
          <MetricIcon><FaThermometerHalf /></MetricIcon>
          <MetricValue>{Math.round(weather.feels_like)}°C</MetricValue>
          <MetricLabel>Feels Like</MetricLabel>
        </Metric>
        
        <Metric>
          <MetricIcon><FaWind /></MetricIcon>
          <MetricValue>{weather.wind_speed} m/s</MetricValue>
          <MetricLabel>Wind</MetricLabel>
        </Metric>
        
        <Metric>
          <MetricIcon><FaTint /></MetricIcon>
          <MetricValue>{weather.humidity}%</MetricValue>
          <MetricLabel>Humidity</MetricLabel>
        </Metric>
        
        <Metric>
          <MetricIcon><FaCompress /></MetricIcon>
          <MetricValue>{weather.pressure} hPa</MetricValue>
          <MetricLabel>Pressure</MetricLabel>
        </Metric>
      </MetricsContainer>
      
      <Timestamp>Updated: {timestamp}</Timestamp>
    </CardContainer>
  );
};

export default WeatherCard; 