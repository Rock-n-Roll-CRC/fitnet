import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon required" },
      { status: 400 },
    );
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
    lat,
  )}&lon=${encodeURIComponent(lon)}`;

  // IMPORTANT: replace with your app name + contact — do NOT fake a browser UA.
  // e.g. "MyCoolApp/1.0 (+https://example.com; contact@yourdomain.com)"
  const USER_AGENT =
    "FitNet/1.0 (+https://fitnet.com; danil.dikhtyar@gmail.com)";

  const r = await fetch(nominatimUrl, {
    headers: {
      "User-Agent": USER_AGENT,
      // You can add Referer if you want (some setups prefer it):
      // "Referer": "https://example.com",
      "Accept-Language": "en",
    },
    // server-side fetch — no browser CORS issues here
  });

  if (!r.ok) {
    const txt = await r.text();
    return NextResponse.json(
      { error: "Nominatim returned an error", status: r.status, details: txt },
      { status: 502 },
    );
  }

  const data = await r.json();

  // OPTIONAL: set caching headers so you don't hammer the public server
  const resp = NextResponse.json(data);
  resp.headers.set("Cache-Control", "public, max-age=300"); // cache 5 minutes
  return resp;
}
