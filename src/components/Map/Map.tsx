"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import type { Tables } from "@/types/database";
import type { Coordinates } from "@/shared/interfaces/Coordinates.interface";

import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { divIcon, Icon } from "leaflet";

import NearbyProfilesList from "@/components/NearbyProfilesList/NearbyProfilesList";

import { calculateAge, calculateDistance } from "@/utilities/helpers";

import navigateUrl from "@/assets/icons/navigate.svg?url";

import styles from "./Map.module.scss";

const MapUpdater = ({ center }: { center: Coordinates }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
};

const Map = ({
  userProfile,
  userCoords,
  displayedProfiles,
  blockedProfiles,
  filters,
  isFilterOpen,
}: {
  userProfile: Tables<"profiles">;
  userCoords: Coordinates;
  displayedProfiles: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  filters: {
    distance: number;
    gender: "male" | "female";
    minAge: number;
    maxAge: number;
  };
  isFilterOpen: boolean;
}) => {
  const [selectedProfile, setSelectedProfile] = useState<Tables<"profiles">>();

  const markerIcon = divIcon({
    html: `<img src="${navigateUrl.src}" class="${styles["map__marker-icon"] ?? ""} ${styles["map__marker-icon--me"] ?? ""}" />`,
    className: styles.map__marker,
    iconAnchor: [30, 15],
  });

  const filteredProfiles = displayedProfiles.filter((profile) => {
    if (!profile.location) return null;

    if (blockedProfiles?.map((el) => el.blocked_id).includes(profile.user_id))
      return false;

    const profilePosition = profile.location as unknown as Coordinates;
    const profileCoords = {
      lat: profilePosition.lat,
      lng: profilePosition.lng,
    };
    const distance = calculateDistance(userCoords, profileCoords);
    const age = profile.birthdate
      ? calculateAge(new Date(profile.birthdate))
      : undefined;

    if (distance > filters.distance) return false;

    if (profile.gender !== filters.gender) return false;

    if (age && age < filters.minAge) return false;

    if (age && age > filters.maxAge) return false;

    return true;
  });

  const blockedIDs =
    blockedProfiles?.map((profile) => profile.blockedProfile.user_id) ?? [];

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

          {filteredProfiles.map((profile) => {
            const { lat, lng } = profile.location as unknown as Coordinates;
            const profileCoords = { lat, lng };
            const icon = new Icon({
              iconUrl: profile.avatar_url,
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className: `${styles["map__marker-icon"] ?? ""} ${(selectedProfile?.user_id === profile.user_id && styles["map__marker-icon--selected"]) || ""}`,
              iconAnchor: [30, 15],
            });
            const redIcon = new Icon({
              iconUrl: profile.avatar_url,
              className: `${styles["map__marker-icon"] ?? ""} ${styles["map__marker-icon--red"] ?? ""}`,
              iconAnchor: [30, 15],
            });

            return (
              <Marker
                key={profile.user_id}
                position={profileCoords}
                eventHandlers={{
                  click: () => {
                    setSelectedProfile(profile);
                  },
                }}
                icon={blockedIDs.includes(profile.user_id) ? redIcon : icon}
              ></Marker>
            );
          })}
          <MapUpdater center={userCoords} />
        </MapContainer>

        <NearbyProfilesList
          userProfile={userProfile}
          displayedProfiles={filteredProfiles}
          blockedCoaches={blockedProfiles ?? []}
        />
      </div>
    </>
  );
};

export default Map;
