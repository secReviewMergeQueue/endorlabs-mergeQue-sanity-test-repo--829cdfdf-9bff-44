import os
import sys
import uvicorn
import ssl
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add the project root to Python path
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from backend.src.api.weather import router as weather_router
from backend.src.api.auth import router as auth_router

# Create FastAPI app
app = FastAPI(
    title="Weather API",
    description="API for retrieving weather data",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(weather_router)
app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Weather API. Use /docs for API documentation."}

if __name__ == "__main__":
    port = int(os.getenv("BACKEND_PORT", 8000))
    host = os.getenv("BACKEND_HOST", "0.0.0.0")
    use_https = os.getenv("USE_HTTPS", "false").lower() == "true"
    
    if use_https:
        # Define SSL context
        ssl_keyfile = os.path.join(os.path.dirname(os.path.dirname(__file__)), "certs/key.pem")
        ssl_certfile = os.path.join(os.path.dirname(os.path.dirname(__file__)), "certs/cert.pem")
        
        # Run with HTTPS
        uvicorn.run(
            app, 
            host=host, 
            port=port,
            ssl_keyfile=ssl_keyfile,
            ssl_certfile=ssl_certfile
        )
    else:
        # Run with HTTP
        uvicorn.run(
            app,
            host=host,
            port=port
        )
