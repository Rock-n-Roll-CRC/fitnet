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
import { divIcon, Icon } from "leaflet";

import NearbyCoachesList from "@/components/NearbyCoachesList/NearbyCoachesList";

import { calculateAge, calculateDistance } from "@/utilities/helpers";

import styles from "./Map.module.scss";
import { updateProfileLocation } from "@/services/actions";
import type { Session } from "next-auth";
import navigateUrl from "@/assets/icons/navigate.svg?url";

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
  userCoords,
  setUserCoords,
  session,
  isFilterOpen,
  userProfile,
}: {
  coaches?: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  isSelectingPosition?: boolean;
  userCoords: { lat: number; lng: number };
  setUserCoords: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  session: Session;
  isFilterOpen: boolean;
  userProfile: Tables<"profiles">;
}) => {
  const searchParams = useSearchParams();

  const [selectedCoach, setSelectedCoach] = useState<Tables<"profiles">>();

  const markerIcon = new divIcon({
    html: `<img src="${navigateUrl.src}" class="${styles["map__marker-icon"] ?? ""} ${styles["map__marker-icon--me"] ?? ""}" />`,
    className: styles.map__marker,
    iconAnchor: [30, 15],
  });

  const filteredCoaches = coaches?.filter((coach) => {
    if (!coach.isSearching) return false;

    if (blockedProfiles?.map((el) => el.blocked_id).includes(coach.user_id))
      return false;

    const coachPosition = coach.location as unknown as Coordinates;
    const coachCoords = {
      lat: coachPosition.lat,
      lng: coachPosition.lng,
    };
    const distance = calculateDistance(userCoords, coachCoords);
    const age = coach.birthdate
      ? calculateAge(new Date(coach.birthdate))
      : undefined;

    const distanceFilter = searchParams.get("distance");
    const genderFilter = searchParams.get("gender");
    const minAgeFilter = searchParams.get("minAge");
    const maxAgeFilter = searchParams.get("maxAge");

    if (distanceFilter && distance > +distanceFilter) return false;

    if (genderFilter && coach.gender !== genderFilter) return false;

    if (minAgeFilter && age && age < +minAgeFilter) return false;

    if (maxAgeFilter && age && age > +maxAgeFilter) return false;

    return true;
  });
  const blockedCoachesIDs = blockedProfiles
    ? blockedProfiles.reduce((accum: string[], item) => {
        return item.blockedProfile.role === "coach"
          ? [...accum, item.blockedProfile.user_id]
          : accum;
      }, [])
    : [];

  function handleMapClick(event: LeafletMouseEvent) {
    if (isSelectingPosition)
      setUserCoords({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          filter: isFilterOpen ? "brightness(0.5)" : undefined,
        }}
      >
        <MapContainer
          center={userCoords}
          zoom={15}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{
            flex: 1,
          }}
        >
          <TileLayer
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> contributors'
          />

          <Marker
            position={userCoords}
            icon={markerIcon}
            zIndexOffset={1000}
          ></Marker>

          {filteredCoaches?.map((coach) => {
            if (!coach.location) return null;

            const { lat, lng } = coach.location as unknown as Coordinates;
            const coachCoords = { lat, lng };
            const icon = new Icon({
              iconUrl: coach.avatar_url,
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className: `${styles["map__marker-icon"] ?? ""} ${(selectedCoach?.user_id === coach.user_id && styles["map__marker-icon--selected"]) || ""}`,
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
              ></Marker>
            );
          })}
          <MapUpdater center={userCoords} />
          <ClickHandler onMapClick={handleMapClick} />
        </MapContainer>

        {userProfile.role === "client" && (
          <NearbyCoachesList
            session={session}
            coaches={filteredCoaches}
            selectedCoach={selectedCoach}
            blockedCoaches={blockedProfiles}
          />
        )}
      </div>
    </>
  );
};

export default Map;
