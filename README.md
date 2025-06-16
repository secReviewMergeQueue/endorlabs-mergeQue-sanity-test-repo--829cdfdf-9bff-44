# Weather App

A full-stack weather application built with a Python FastAPI backend and a React TypeScript frontend. This monorepo contains both the backend and frontend code.

## Features

- **Current Weather Display**: View current weather conditions for any city or coordinates
- **Weather Forecast**: 5-day weather forecast with detailed information
- **Interactive Map**: Select locations directly on the map to get weather data
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Python 3.9+
- FastAPI for API endpoints
- Pydantic for data validation
- OpenWeatherMap API for weather data

### Frontend
- React 18 with TypeScript
- React Query for data fetching
- Styled Components for styling
- Leaflet for interactive maps

## Architecture

The application follows SOLID principles and uses a clean architecture approach:

- **Backend**:
  - Models: Data models using Pydantic
  - Services: Weather data providers and services
  - API: FastAPI endpoints

- **Frontend**:
  - Components: Reusable UI components
  - Services: API integration
  - Hooks: Custom React hooks

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenWeatherMap API key (get it at [OpenWeatherMap](https://openweathermap.org/api))

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/weather-monorepo.git
   cd weather-monorepo
   ```

2. Setup the backend:
   ```
   cd backend
   pip install -r requirements.txt
   mkdir certs
   cd certs
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
   ```

3. Create a `.env` file in the backend directory:
   ```
   OPENWEATHERMAP_API_KEY=your_api_key_here
   BACKEND_PORT=8000
   BACKEND_HOST=0.0.0.0
   ENVIRONMENT=development
   ```

4. Setup the frontend:
   ```
   cd ../frontend
   npm install
   ```

5. Start the backend:
   ```
   python backend/src/main.py
   
   ```
   verify the backend by visiting http://localhost:8000/docs in browser, try a sample request with swagger
   ![image](https://github.com/user-attachments/assets/5e88c8a1-219a-46b1-890f-69f4f18f574b)



7. Start the frontend in a new terminal:
   ```
   cd ../frontend
   npm start
   ```

8. Open your browser and navigate to `http://localhost:3000`
 <img width="1555" alt="image" src="https://github.com/user-attachments/assets/8581c8c4-3b63-48d6-9b5b-fd6f97cd4ac6" />


### Using Docker

Alternatively, you can use Docker Compose to run both services:

1. Make sure Docker and Docker Compose are installed
2. Create the necessary `.env` files in both backend and frontend directories
3. Run:
   ```
   docker-compose up -d
   ```
4. Access the application at `http://localhost:3000`

## Testing

### Backend Tests
```
cd backend
pytest
```

### Frontend Tests
```
cd frontend
npm test
```

## Project Structure

```
weather-monorepo/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   ├── tests/
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── README.md
```

## UI Mockup

### Desktop View
```
+------------------------------------------+
|              Weather App                 |
+------------------------------------------+
|                                          |
| [Search for a city...]        [Search]   |
|                                          |
| +------------------+  +------------------+
| | Current Weather  |  |                  |
| | City, Country    |  |                  |
| | 21°C Sunny       |  |    Interactive   |
| |                  |  |       Map        |
| | Humidity: 65%    |  |                  |
| | Wind: 5.1 m/s    |  |                  |
| +------------------+  +------------------+
|                                          |
| +---------5-Day Forecast-----------------+
| |                                        |
| | +------+ +------+ +------+ +------+    |
| | | Mon  | | Tue  | | Wed  | | Thu  |    |
| | | 23°C | | 22°C | | 20°C | | 21°C |    |
| | | Sunny| | Cloudy| | Rain | | Sunny|    |
| | +------+ +------+ +------+ +------+    |
| |                                        |
| +----------------------------------------+
|                                          |
+------------------------------------------+
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
