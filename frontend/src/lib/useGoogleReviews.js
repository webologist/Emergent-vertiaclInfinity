import { useEffect, useState } from "react";

const API = process.env.REACT_APP_BACKEND_URL || "";
const MAPS_URI = "https://maps.google.com/?cid=885671371509995655";

export function useGoogleReviews() {
  const [rev, setRev] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setRev)
      .catch(() => setRev(null));
  }, []);
  return {
    live: !!rev?.live,
    rating: rev?.rating ?? 4.9,
    count: rev?.live && rev.review_count != null ? rev.review_count : null,
    mapsUri: rev?.google_maps_uri || MAPS_URI,
    writeUri: rev?.write_review_uri || rev?.google_maps_uri || MAPS_URI,
  };
}
