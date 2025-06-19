"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { updateProfileGeolocation } from "@/services/actions";
import type { Session } from "next-auth";
import { useSearchParams } from "next/navigation";
import { calculateDistance } from "@/utilities/helpers";

const Map = ({ session, coaches }: { session: Session; coaches: any[] }) => {
  const searchParams = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());
  const [position, setPosition] = useState<GeolocationPosition>();
  const [nearbyCoaches, setNearbyCoaches] = useState(coaches);

  useEffect(() => {
    setNearbyCoaches(coaches);

    if (position) {
      if (filters.minDistance) {
        setNearbyCoaches((nearbyCoaches) =>
          nearbyCoaches.filter((coach) => {
            const position1 = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const position2 = {
              lat: JSON.parse(coach.geolocation).coords.latitude,
              lng: JSON.parse(coach.geolocation).coords.longitude,
            };

            const distance = calculateDistance(position1, position2);

            return distance >= +filters.minDistance;
          }),
        );
      }

      if (filters.maxDistance) {
        setNearbyCoaches((nearbyCoaches) =>
          nearbyCoaches.filter((coach) => {
            const position1 = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            const position2 = {
              lat: JSON.parse(coach.geolocation).coords.latitude,
              lng: JSON.parse(coach.geolocation).coords.longitude,
            };

            const distance = calculateDistance(position1, position2);

            return distance <= +filters.maxDistance;
          }),
        );
      }
    }
  }, [coaches, filters.maxDistance, filters.minDistance, position]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition(position);

      void (async () => {
        await updateProfileGeolocation(session.user.id, position.toJSON());
      })();
    });
  }, [session.user.id]);

  return (
    <>
      {position ? (
        <MapContainer
          center={[position.coords.latitude, position.coords.longitude]}
          zoom={15}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[position.coords.latitude, position.coords.longitude]}
          >
            <Tooltip direction="top" offset={[-15, -20]} permanent>
              Me
            </Tooltip>
          </Marker>
          {nearbyCoaches.map((coach) => (
            <Marker
              key={coach}
              position={[
                JSON.parse(coach.geolocation).coords.latitude,
                JSON.parse(coach.geolocation).coords.longitude,
              ]}
            >
              <Tooltip direction="top" offset={[-15, -20]} permanent>
                {coach["full_name"]}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      ) : null}
    </>
  );
};

export default Map;
