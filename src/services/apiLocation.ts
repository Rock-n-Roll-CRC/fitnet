import type { RefObject } from "react";

interface PhotonFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] }; // [lon, lat]
  properties: {
    name?: string;
    country?: string;
    city?: string;
    state?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    osm_type?: string;
    osm_id?: number;
    [k: string]: any;
  };
}

interface PhotonResponse {
  type: "FeatureCollection";
  features: PhotonFeature[];
}

export const getAddressByCoords = async (coords: {
  lat: number;
  lng: number;
}) => {
  const res = await fetch(
    `https://photon.komoot.io/reverse?lat=${coords.lat.toString()}&lon=${coords.lng.toString()}&lang=en`,
  );

  const data = (await res.json()) as PhotonResponse;
  const feature = data.features[0];

  if (feature)
    return [
      feature.properties.housenumber,
      feature.properties.name,
      feature.properties.locality,
      feature.properties.district,
      feature.properties.city,
      feature.properties.postcode,
      feature.properties.country,
    ]
      .filter(Boolean)
      .join(", ");
};

export const getSuggestions = async (
  query: string,
  controllerRef: RefObject<AbortController | null>,
) => {
  controllerRef.current?.abort();
  const ctrl = new AbortController();
  controllerRef.current = ctrl;

  const params = new URLSearchParams({
    q: query,
    limit: "5",
    lang: "en",
  });

  const res = await fetch(
    `https://photon.komoot.io/api/?${params.toString()}`,
    { signal: ctrl.signal },
  );

  const data = (await res.json()) as PhotonResponse;

  const seen = new Set<string>();
  const mappedData = data.features
    .filter((feature) => {
      const key = `${feature.properties.name}-${feature.geometry.coordinates.join(",")}`;
      if (seen.has(key)) return false;
      seen.add(key);

      if (
        feature.properties.type === "district" &&
        data.features.some(
          (f) =>
            f.properties.name === feature.properties.name &&
            f.properties.type === "city",
        )
      ) {
        return false;
      }

      return true;
    })
    .map((feature) => ({
      name: [
        feature.properties.housenumber,
        feature.properties.name,
        feature.properties.locality,
        feature.properties.district,
        feature.properties.city,
        feature.properties.postcode,
        feature.properties.country,
      ]
        .filter(Boolean)
        .join(", "),
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      properties: feature.properties,
    }));

  return mappedData;
};

export const getCityByCoords = async (coords: { lat: number; lng: number }) => {
  const res = await fetch(
    `https://photon.komoot.io/reverse?lat=${coords.lat.toString()}&lon=${coords.lng.toString()}&lang=en`,
  );

  const data = (await res.json()) as PhotonResponse;

  return data.features[0]?.properties.city;
};
