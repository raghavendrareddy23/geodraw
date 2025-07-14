import React, { useEffect, useState } from "react";
import {
  SunIcon,
  CloudIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Weather = () => {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lon: longitude });
      },
      () => setError("Permission denied or error fetching location.")
    );
  }, []);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    if (location.lat && location.lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${apiKey}`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeather(data);
          setUpdatedAt(new Date().toLocaleTimeString());
        })
        .catch(() => setError("Failed to fetch weather data."));
    }
  }, [location]);

  if (error) {
    return (
      <div className="bg-white text-red-600 p-6 rounded-xl shadow text-center w-full max-w-md mx-auto">
        {error}
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white text-gray-500 p-6 rounded-xl shadow text-center w-full max-w-md mx-auto">
        Loading weather data...
      </div>
    );
  }

  const { temp, humidity } = weather.main;
  const wind = weather.wind?.speed ?? "N/A";
  const condition = weather.weather?.[0]?.main ?? "N/A";
  const city = weather.name ?? "Unknown";
  const country = weather.sys?.country ?? "";

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-100 to-white shadow-lg rounded-2xl p-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <MapPinIcon className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-700">
          {city}, {country}
        </h2>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2">
          <SunIcon className="h-8 w-8 text-yellow-400" />
          <p className="text-4xl font-bold text-gray-800">{Math.round(temp)}°C</p>
        </div>
        <p className="text-sm text-gray-600 capitalize mt-1">{condition}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CloudIcon className="h-5 w-5 text-indigo-500" />
          <span>Humidity: {humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpRightIcon className="h-5 w-5 text-green-600" />
          <span>Wind: {wind} m/s</span>
        </div>
      </div>

      <div className="flex items-center justify-center text-xs text-gray-500 mt-6">
        <ArrowPathIcon className="h-4 w-4 mr-1" />
        <span>Last updated at {updatedAt}</span>
      </div>
    </div>
  );
};

export default Weather;
