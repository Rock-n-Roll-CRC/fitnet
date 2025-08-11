"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import type { Tables } from "@/types/database";
import type { LeafletMouseEvent, LeafletMouseEventHandlerFn } from "leaflet";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "next/navigation";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { Icon } from "leaflet";

import CoachDetailsModal from "@/components/CoachDetailsModal/CoachDetailsModal";

import { calculateDistance } from "@/utilities/helpers";

import styles from "./Map.module.scss";
import { updateProfileLocation } from "@/services/actions";
import type { Session } from "next-auth";

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

const ClickHandler = ({
  onMapClick,
}: {
  onMapClick: LeafletMouseEventHandlerFn;
}) => {
  useMapEvent("click", onMapClick);

  return null;
};

const Map = ({
  coaches,
  blockedProfiles,
  isSelectingPosition,
  userCoords: userCoordsProp,
  setUserCoords: setUserCoordsProp,
  session,
  isFilterOpen,
}: {
  coaches?: Tables<"profiles">[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  isSelectingPosition?: boolean;
  userCoords?: Coordinates;
  setUserCoords?: Dispatch<SetStateAction<Coordinates | undefined>>;
  session: Session;
  isFilterOpen: boolean;
}) => {
  const searchParams = useSearchParams();

  const [userCoords, setUserCoords] = useState<Coordinates>();
  const [cityCoords, setCityCoords] = useState<Coordinates>();
  const [inputCity, setInputCity] = useState("");
  const [isPositionDenied, setIsPositionDenied] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Tables<"profiles">>();

  const currentUserCoords = userCoordsProp ?? userCoords;
  const currentSetUserCoords = setUserCoordsProp ?? setUserCoords;
  const mapCenter = currentUserCoords ??
    cityCoords ?? { lat: 51.5074, lng: -0.1278 };
  const filteredCoaches = coaches?.filter((coach) => {
    if (!coach.isSearching) return false;

    if (!currentUserCoords || !coach.location) return true;

    const coachPosition = coach.location as unknown as Coordinates;
    const coachCoords = {
      lat: coachPosition.lat,
      lng: coachPosition.lng,
    };

    const distance = calculateDistance(currentUserCoords, coachCoords);
    const minDistance = searchParams.get("minDistance");
    const maxDistance = searchParams.get("maxDistance");

    if (minDistance && maxDistance)
      return distance >= +minDistance && distance <= +maxDistance;
    if (minDistance) return distance >= +minDistance;
    if (maxDistance) return distance <= +maxDistance;

    return true;
  });
  const blockedCoachesIDs = blockedProfiles
    ? blockedProfiles.reduce((accum: string[], item) => {
        return item.blockedProfile.role === "coach"
          ? [...accum, item.blockedProfile.user_id]
          : accum;
      }, [])
    : [];

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

  function handleMapClick(event: LeafletMouseEvent) {
    if (isSelectingPosition)
      currentSetUserCoords({ lat: event.latlng.lat, lng: event.latlng.lng });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        currentSetUserCoords({ lat, lng });
        void (async () => {
          await updateProfileLocation(session.user.id, { lat, lng });
        })();
      },
      () => {
        setIsPositionDenied(true);
      },
      { enableHighAccuracy: true },
    );
  }, [currentSetUserCoords, session.user.id]);

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          filter: isFilterOpen ? "brightness(0.5)" : undefined,
        }}
      >
        <MapContainer
          center={mapCenter}
          zoom={15}
          zoomControl={false}
          style={{
            flex: 1,
          }}
        >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> contributors'
          />
          {currentUserCoords && (
            <Marker position={currentUserCoords}>
              <Tooltip direction="top" offset={[-15, -20]} permanent>
                You
              </Tooltip>
            </Marker>
          )}
          {filteredCoaches?.map((coach) => {
            if (!coach.location) return null;

            const { lat, lng } = coach.location as unknown as Coordinates;
            const coachCoords = { lat, lng };
            const icon = new Icon({
              iconUrl: coach.avatar_url,
              className: styles["map__marker-icon"],
              iconAnchor: [30, 15],
            });
            const redIcon = new Icon({
              iconUrl: coach.avatar_url,
              className: `${styles["map__marker-icon"] ?? ""} ${styles["map__marker-icon--red"] ?? ""}`,
              iconAnchor: [30, 15],
            });

            return (
              <Marker
                key={coach.user_id}
                position={coachCoords}
                eventHandlers={{
                  click: () => {
                    setSelectedCoach(coach);
                  },
                }}
                icon={
                  blockedCoachesIDs.includes(coach.user_id) ? redIcon : icon
                }
              >
                <Tooltip direction="top" offset={[-15, -20]} permanent>
                  {coach.full_name}
                </Tooltip>
              </Marker>
            );
          })}
          <MapUpdater center={mapCenter} />
          <ClickHandler onMapClick={handleMapClick} />
        </MapContainer>
        {selectedCoach && (
          <CoachDetailsModal
            coach={selectedCoach}
            session={session}
            blockedProfiles={blockedProfiles}
            onClose={() => {
              setSelectedCoach(undefined);
            }}
          />
        )}
      </div>
    </>
  );
};

export default Map;
