import React from 'react';
import styled from 'styled-components';
import { ForecastItem } from '../types/weather';
import { FaThermometerHalf, FaWind, FaTint, FaUmbrella } from 'react-icons/fa';

interface ForecastCardProps {
  forecast: ForecastItem;
}

const Card = styled.div`
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 150px;
`;

const DateLabel = styled.div`
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
`;

const Icon = styled.img`
  width: 50px;
  height: 50px;
  margin-bottom: 0.5rem;
`;

const TempRange = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
`;

const MaxTemp = styled.span`
  font-weight: bold;
  color: var(--danger-color);
`;

const MinTemp = styled.span`
  font-weight: bold;
  color: var(--primary-color);
  margin-left: 0.5rem;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.5rem;
  width: 100%;
`;

const Metric = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-color);
`;

const MetricIcon = styled.div`
  margin-right: 0.3rem;
  color: var(--primary-color);
`;

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  // Format the date
  const date = new Date(forecast.date);
  const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  
  // Get the main condition
  const mainCondition = forecast.conditions[0];

  return (
    <Card>
      <DateLabel>{formattedDate}</DateLabel>
      <Icon 
        src={`https://openweathermap.org/img/wn/${mainCondition.icon}@2x.png`} 
        alt={mainCondition.description} 
      />
      <TempRange>
        <MaxTemp>{Math.round(forecast.temp_max)}°</MaxTemp>
        <MinTemp>{Math.round(forecast.temp_min)}°</MinTemp>
      </TempRange>
      
      <MetricsContainer>
        <Metric>
          <MetricIcon><FaUmbrella /></MetricIcon>
          {Math.round(forecast.precipitation_chance)}%
        </Metric>
        <Metric>
          <MetricIcon><FaTint /></MetricIcon>
          {forecast.humidity}%
        </Metric>
        <Metric>
          <MetricIcon><FaWind /></MetricIcon>
          {forecast.wind_speed} m/s
        </Metric>
        <Metric>
          <MetricIcon><FaThermometerHalf /></MetricIcon>
          {mainCondition.main}
        </Metric>
      </MetricsContainer>
    </Card>
  );
};

export default ForecastCard; 