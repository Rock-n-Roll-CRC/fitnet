"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import type { Tables } from "@/types/database";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";

import CoachDetailsModal from "@/components/CoachDetailsModal/CoachDetailsModal";

import { calculateDistance } from "@/utilities/helpers";

import styles from "./Map.module.scss";

interface Coordinates {
  lat: number;
  lng: number;
}

interface OpenMeteoCityItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  admin1_id: number;
  timezone: string;
  population: number;
  country_id: number;
  country: string;
  admin1: string;
}

interface OpenMeteoData {
  results?: OpenMeteoCityItem[];
  generationtime_ms: number;
}

const MapUpdater = ({ center }: { center: Coordinates }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

const Map = ({ coaches }: { coaches: Tables<"profiles">[] }) => {
  const searchParams = useSearchParams();

  const [userCoords, setUserCoords] = useState<Coordinates>();
  const [cityCoords, setCityCoords] = useState<Coordinates>();
  const [inputCity, setInputCity] = useState("");
  const [isPositionDenied, setIsPositionDenied] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Tables<"profiles">>();

  const mapCenter = userCoords ?? cityCoords ?? { lat: 51.5074, lng: -0.1278 };
  const filteredCoaches = coaches.filter((coach) => {
    if (!userCoords) return true;

    const coachPosition = JSON.parse(
      coach.geolocation as string,
    ) as GeolocationPosition;
    const coachCoords = {
      lat: coachPosition.coords.latitude,
      lng: coachPosition.coords.longitude,
    };

    const distance = calculateDistance(userCoords, coachCoords);
    const minDistance = searchParams.get("minDistance");
    const maxDistance = searchParams.get("maxDistance");

    if (minDistance && maxDistance)
      return distance >= +minDistance && distance <= +maxDistance;
    if (minDistance) return distance >= +minDistance;
    if (maxDistance) return distance <= +maxDistance;

    return true;
  });

  async function handleFetchCityCoords() {
    try {
      if (!inputCity) throw new Error("The city must be defined.");

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${inputCity}&count=1`,
      );
      const data = (await response.json()) as OpenMeteoData;

      const city = data.results?.at(0);

      if (!city) throw new Error("The city could not be found.");

      setCityCoords({ lat: city.latitude, lng: city.longitude });
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to fetch city's coordinates: ${error.message}`);
        throw new Error(`Failed to fetch city's coordinates: ${error.message}`);
      }
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setUserCoords({ lat, lng });
      },
      () => {
        setIsPositionDenied(true);
      },
      { enableHighAccuracy: true },
    );
  }, []);

  return (
    <>
      {isPositionDenied && (
        <div>
          <label htmlFor="city">Your city:</label>
          <input
            type="text"
            name="city"
            id="city"
            value={inputCity}
            onChange={(event) => {
              setInputCity(event.target.value);
            }}
          />
          <button onClick={() => void handleFetchCityCoords()}>Submit</button>
        </div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={15}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {userCoords && (
          <Marker position={userCoords}>
            <Tooltip direction="top" offset={[-15, -20]} permanent>
              You
            </Tooltip>
          </Marker>
        )}
        {filteredCoaches.map((coach) => {
          const {
            coords: { latitude: lat, longitude: lng },
          } = JSON.parse(coach.geolocation as string) as GeolocationPosition;
          const coachCoords = { lat, lng };
          const icon = new Icon({
            iconUrl: coach.avatar,
            className: styles["map__marker-icon"],
            iconAnchor: [30, 15],
          });

          return (
            <Marker
              key={coach.id}
              position={coachCoords}
              eventHandlers={{
                click: () => {
                  setSelectedCoach(coach);
                },
              }}
              icon={icon}
            >
              <Tooltip direction="top" offset={[-15, -20]} permanent>
                {coach.full_name}
              </Tooltip>
            </Marker>
          );
        })}
        <MapUpdater center={mapCenter} />
      </MapContainer>
      <CoachDetailsModal
        coach={selectedCoach}
        onClose={() => {
          setSelectedCoach(undefined);
        }}
      />
    </>
  );
};

export default Map;
