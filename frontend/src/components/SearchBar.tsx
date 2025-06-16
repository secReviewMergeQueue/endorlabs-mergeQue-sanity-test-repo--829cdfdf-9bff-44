import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: var(--primary-color);
  }
`;

const SearchButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0 1.25rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--secondary-color);
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger-color);
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setError('');
    onSearch(city.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <SearchButton type="submit">
          <FaSearch />
        </SearchButton>
      </SearchContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
};

export default SearchBar; 