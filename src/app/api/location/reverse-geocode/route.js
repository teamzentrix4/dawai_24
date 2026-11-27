import { NextResponse } from "next/server";

// Fallback lookup dictionary for common Indian cities and sample postal codes
const FALLBACK_CITIES = [
  { city: "Bengaluru", state: "Karnataka", pincode: "560001", area: "MG Road, Central Bengaluru", lat: 12.9716, lng: 77.5946 },
  { city: "Bengaluru", state: "Karnataka", pincode: "560102", area: "HSR Layout, Bengaluru", lat: 12.9121, lng: 77.6446 },
  { city: "Bengaluru", state: "Karnataka", pincode: "560034", area: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245 },
  { city: "Bengaluru", state: "Karnataka", pincode: "560066", area: "Whitefield, Bengaluru", lat: 12.9698, lng: 77.7500 },
  { city: "Bengaluru", state: "Karnataka", pincode: "560078", area: "JP Nagar, Bengaluru", lat: 12.9063, lng: 77.5857 },
  { city: "Bengaluru", state: "Karnataka", pincode: "560038", area: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408 },
  { city: "Mumbai", state: "Maharashtra", pincode: "400001", area: "Fort, South Mumbai", lat: 18.9322, lng: 72.8347 },
  { city: "Mumbai", state: "Maharashtra", pincode: "400050", area: "Bandra West, Mumbai", lat: 19.0596, lng: 72.8295 },
  { city: "Mumbai", state: "Maharashtra", pincode: "400053", area: "Andheri West, Mumbai", lat: 19.1363, lng: 72.8277 },
  { city: "New Delhi", state: "Delhi", pincode: "110001", area: "Connaught Place, Central Delhi", lat: 28.6304, lng: 77.2177 },
  { city: "New Delhi", state: "Delhi", pincode: "110016", area: "Hauz Khas, South Delhi", lat: 28.5494, lng: 77.2001 },
  { city: "New Delhi", state: "Delhi", pincode: "110085", area: "Rohini, North West Delhi", lat: 28.7041, lng: 77.1025 },
  { city: "Gurugram", state: "Haryana", pincode: "122002", area: "DLF Cyber City / Phase 2", lat: 28.4907, lng: 77.0898 },
  { city: "Noida", state: "Uttar Pradesh", pincode: "201301", area: "Sector 18, Noida", lat: 28.5708, lng: 77.3271 },
  { city: "Hyderabad", state: "Telangana", pincode: "500081", area: "HITEC City, Madhapur", lat: 17.4435, lng: 78.3772 },
  { city: "Hyderabad", state: "Telangana", pincode: "500034", area: "Banjara Hills, Hyderabad", lat: 17.4156, lng: 78.4350 },
  { city: "Chennai", state: "Tamil Nadu", pincode: "600017", area: "T. Nagar, Chennai", lat: 13.0418, lng: 80.2341 },
  { city: "Chennai", state: "Tamil Nadu", pincode: "600028", area: "RA Puram / Adyar, Chennai", lat: 13.0238, lng: 80.2565 },
  { city: "Kolkata", state: "West Bengal", pincode: "700016", area: "Park Street, Kolkata", lat: 22.5512, lng: 88.3524 },
  { city: "Kolkata", state: "West Bengal", pincode: "700091", area: "Salt Lake Sector V, Kolkata", lat: 22.5804, lng: 88.4378 },
  { city: "Pune", state: "Maharashtra", pincode: "411001", area: "Camp / Station, Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Pune", state: "Maharashtra", pincode: "411057", area: "Hinjawadi, Pune", lat: 18.5913, lng: 73.7389 },
  { city: "Ahmedabad", state: "Gujarat", pincode: "380009", area: "Navrangpura, Ahmedabad", lat: 23.0365, lng: 72.5611 },
  { city: "Jaipur", state: "Rajasthan", pincode: "302001", area: "MI Road, Pink City, Jaipur", lat: 26.9124, lng: 75.7873 },
  { city: "Lucknow", state: "Uttar Pradesh", pincode: "226001", area: "Hazratganj, Lucknow", lat: 26.8467, lng: 80.9462 },
  { city: "Chandigarh", state: "Chandigarh", pincode: "160017", area: "Sector 17, Chandigarh", lat: 30.7398, lng: 76.7827 }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ error: "Invalid coordinates format" }, { status: 400 });
    }

    // Attempt reverse geocoding via OpenStreetMap Nominatim with proper User-Agent
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "User-Agent": "Dawai24-PharmacyApp/1.0 (delivery-location@dawai24.in)",
            "Accept-Language": "en-IN,en;q=0.9"
          },
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};

        const city =
          addr.city ||
          addr.town ||
          addr.city_district ||
          addr.suburb ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          "";

        const state = addr.state || "";
        const pincode = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";
        const area =
          addr.neighbourhood ||
          addr.suburb ||
          addr.residential ||
          addr.road ||
          addr.commercial ||
          addr.industrial ||
          city ||
          "";

        const formattedAddress = data.display_name || [area, city, state, pincode].filter(Boolean).join(", ");

        if (city || state || pincode) {
          return NextResponse.json({
            lat: latitude,
            lng: longitude,
            city: city || "Bengaluru",
            state: state || "Karnataka",
            pincode: pincode || "",
            area: area || city,
            formattedAddress: formattedAddress,
            source: "nominatim"
          });
        }
      }
    } catch (apiErr) {
      console.warn("Nominatim reverse geocode failed or timed out:", apiErr.message);
    }

    // Fallback: Find closest city from fallback list
    let closest = FALLBACK_CITIES[0];
    let minDistance = Infinity;

    for (const item of FALLBACK_CITIES) {
      const dLat = item.lat - latitude;
      const dLng = item.lng - longitude;
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDistance) {
        minDistance = dist;
        closest = item;
      }
    }

    return NextResponse.json({
      lat: latitude,
      lng: longitude,
      city: closest.city,
      state: closest.state,
      pincode: closest.pincode,
      area: closest.area,
      formattedAddress: `${closest.area}, ${closest.city}, ${closest.state} ${closest.pincode}`,
      source: "fallback_closest"
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json(
      { error: "Failed to reverse geocode coordinates" },
      { status: 500 }
    );
  }
}
