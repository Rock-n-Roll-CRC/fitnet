export const calculateDistance = (
  position1: { lat: number; lng: number },
  position2: { lat: number; lng: number },
) => {
  const R = 6371000;

  const lat1Rad = position1.lat * (Math.PI / 180);
  const long1Rad = position1.lng * (Math.PI / 180);
  const lat2Rad = position2.lat * (Math.PI / 180);
  const long2Rad = position2.lng * (Math.PI / 180);

  const deltaLat = lat2Rad - lat1Rad;
  const deltaLong = long2Rad - long1Rad;

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLong / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return distance;
};
