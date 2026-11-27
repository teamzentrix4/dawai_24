import { NextResponse } from "next/server";

const POPULAR_LOCATIONS = [
  { id: "blr-1", city: "Bengaluru", state: "Karnataka", pincode: "560102", area: "HSR Layout", lat: 12.9121, lng: 77.6446, formattedAddress: "HSR Layout, Bengaluru, Karnataka 560102" },
  { id: "blr-2", city: "Bengaluru", state: "Karnataka", pincode: "560034", area: "Koramangala", lat: 12.9352, lng: 77.6245, formattedAddress: "Koramangala, Bengaluru, Karnataka 560034" },
  { id: "blr-3", city: "Bengaluru", state: "Karnataka", pincode: "560038", area: "Indiranagar", lat: 12.9784, lng: 77.6408, formattedAddress: "Indiranagar, Bengaluru, Karnataka 560038" },
  { id: "blr-4", city: "Bengaluru", state: "Karnataka", pincode: "560066", area: "Whitefield", lat: 12.9698, lng: 77.7500, formattedAddress: "Whitefield, Bengaluru, Karnataka 560066" },
  { id: "blr-5", city: "Bengaluru", state: "Karnataka", pincode: "560078", area: "JP Nagar", lat: 12.9063, lng: 77.5857, formattedAddress: "JP Nagar, Bengaluru, Karnataka 560078" },
  { id: "blr-6", city: "Bengaluru", state: "Karnataka", pincode: "560001", area: "MG Road / Central", lat: 12.9716, lng: 77.5946, formattedAddress: "MG Road, Bengaluru, Karnataka 560001" },
  { id: "mum-1", city: "Mumbai", state: "Maharashtra", pincode: "400050", area: "Bandra West", lat: 19.0596, lng: 72.8295, formattedAddress: "Bandra West, Mumbai, Maharashtra 400050" },
  { id: "mum-2", city: "Mumbai", state: "Maharashtra", pincode: "400053", area: "Andheri West", lat: 19.1363, lng: 72.8277, formattedAddress: "Andheri West, Mumbai, Maharashtra 400053" },
  { id: "mum-3", city: "Mumbai", state: "Maharashtra", pincode: "400001", area: "Fort / Nariman Point", lat: 18.9322, lng: 72.8347, formattedAddress: "Fort, South Mumbai, Maharashtra 400001" },
  { id: "del-1", city: "New Delhi", state: "Delhi", pincode: "110001", area: "Connaught Place", lat: 28.6304, lng: 77.2177, formattedAddress: "Connaught Place, New Delhi, Delhi 110001" },
  { id: "del-2", city: "New Delhi", state: "Delhi", pincode: "110016", area: "Hauz Khas", lat: 28.5494, lng: 77.2001, formattedAddress: "Hauz Khas, New Delhi, Delhi 110016" },
  { id: "del-3", city: "New Delhi", state: "Delhi", pincode: "110085", area: "Rohini", lat: 28.7041, lng: 77.1025, formattedAddress: "Rohini, New Delhi, Delhi 110085" },
  { id: "ggn-1", city: "Gurugram", state: "Haryana", pincode: "122002", area: "DLF Cyber Hub / Phase 2", lat: 28.4907, lng: 77.0898, formattedAddress: "DLF Cyber City, Gurugram, Haryana 122002" },
  { id: "noi-1", city: "Noida", state: "Uttar Pradesh", pincode: "201301", area: "Sector 18", lat: 28.5708, lng: 77.3271, formattedAddress: "Sector 18, Noida, Uttar Pradesh 201301" },
  { id: "hyd-1", city: "Hyderabad", state: "Telangana", pincode: "500081", area: "HITEC City / Madhapur", lat: 17.4435, lng: 78.3772, formattedAddress: "HITEC City, Madhapur, Hyderabad, Telangana 500081" },
  { id: "hyd-2", city: "Hyderabad", state: "Telangana", pincode: "500034", area: "Banjara Hills", lat: 17.4156, lng: 78.4350, formattedAddress: "Banjara Hills, Hyderabad, Telangana 500034" },
  { id: "chn-1", city: "Chennai", state: "Tamil Nadu", pincode: "600017", area: "T. Nagar", lat: 13.0418, lng: 80.2341, formattedAddress: "T. Nagar, Chennai, Tamil Nadu 600017" },
  { id: "chn-2", city: "Chennai", state: "Tamil Nadu", pincode: "600028", area: "Adyar", lat: 13.0238, lng: 80.2565, formattedAddress: "Adyar, Chennai, Tamil Nadu 600028" },
  { id: "pun-1", city: "Pune", state: "Maharashtra", pincode: "411057", area: "Hinjawadi", lat: 18.5913, lng: 73.7389, formattedAddress: "Hinjawadi Phase 1, Pune, Maharashtra 411057" },
  { id: "pun-2", city: "Pune", state: "Maharashtra", pincode: "411014", area: "Viman Nagar", lat: 18.5679, lng: 73.9143, formattedAddress: "Viman Nagar, Pune, Maharashtra 411014" },
  { id: "kol-1", city: "Kolkata", state: "West Bengal", pincode: "700091", area: "Salt Lake Sector V", lat: 22.5804, lng: 88.4378, formattedAddress: "Salt Lake Sector V, Kolkata, West Bengal 700091" },
  { id: "ahm-1", city: "Ahmedabad", state: "Gujarat", pincode: "380015", area: "Satellite", lat: 23.0300, lng: 72.5178, formattedAddress: "Satellite, Ahmedabad, Gujarat 380015" },
  { id: "jai-1", city: "Jaipur", state: "Rajasthan", pincode: "302015", area: "Malviya Nagar", lat: 26.8532, lng: 75.8197, formattedAddress: "Malviya Nagar, Jaipur, Rajasthan 302015" },
  { id: "luc-1", city: "Lucknow", state: "Uttar Pradesh", pincode: "226010", area: "Gomti Nagar", lat: 26.8524, lng: 80.9992, formattedAddress: "Gomti Nagar, Lucknow, Uttar Pradesh 226010" }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      // Return popular locations as initial suggestions
      return NextResponse.json({
        results: POPULAR_LOCATIONS.slice(0, 8),
        popular: true
      });
    }

    const cleanQ = q.toLowerCase();
    const isPincode = /^\d{2,6}$/.test(q);

    // Filter local matching results first
    const localMatches = POPULAR_LOCATIONS.filter((item) => {
      if (isPincode) {
        return item.pincode.startsWith(q);
      }
      return (
        item.area.toLowerCase().includes(cleanQ) ||
        item.city.toLowerCase().includes(cleanQ) ||
        item.state.toLowerCase().includes(cleanQ) ||
        item.pincode.includes(q)
      );
    });

    // If query is at least 3 characters, also query OpenStreetMap Nominatim for accurate India-wide search
    let remoteMatches = [];
    if (cleanQ.length >= 3) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            q + (isPincode ? " India" : ", India")
          )}&format=jsonv2&addressdetails=1&countrycodes=in&limit=8`,
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
          remoteMatches = data.map((item, index) => {
            const addr = item.address || {};
            const city =
              addr.city ||
              addr.town ||
              addr.city_district ||
              addr.suburb ||
              addr.village ||
              addr.municipality ||
              addr.county ||
              addr.state_district ||
              item.name ||
              "";

            const state = addr.state || "";
            const pincode = addr.postcode ? addr.postcode.replace(/\D/g, "").slice(0, 6) : "";
            const area =
              addr.neighbourhood ||
              addr.suburb ||
              addr.road ||
              addr.residential ||
              item.name ||
              city;

            return {
              id: `nom-${item.place_id || index}`,
              city: city || area,
              state: state,
              pincode: pincode,
              area: area,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              formattedAddress: item.display_name || `${area}, ${city}, ${state} ${pincode}`.trim()
            };
          });
        }
      } catch (err) {
        console.warn("Nominatim autocomplete query failed:", err.message);
      }
    }

    // Merge and deduplicate
    const combined = [...localMatches];
    const seen = new Set(
      localMatches.map((m) => `${m.city.toLowerCase()}-${m.pincode}-${m.area.toLowerCase()}`)
    );

    for (const r of remoteMatches) {
      const key = `${r.city.toLowerCase()}-${r.pincode}-${r.area.toLowerCase()}`;
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(r);
      }
    }

    return NextResponse.json({
      results: combined.slice(0, 10),
      popular: false
    });
  } catch (error) {
    console.error("Location search error:", error);
    return NextResponse.json(
      { error: "Failed to search locations", results: [] },
      { status: 500 }
    );
  }
}
