import { movieInstance } from "./MovieInstance";
import requests from "./requestUrls";

// Fetch a YouTube trailer key for a TMDB item.
// item = { id, media_type }  →  media_type is "tv" or "movie"
export async function fetchTrailer(item) {
  if (!item?.id) return null;

  try {
    // Trending returns mixed media; default to "movie" when unknown.
    const mediaType = item.media_type === "tv" ? "tv" : "movie";
    const endpoint =
      mediaType === "tv"
        ? requests.fetchTvVideos(item.id)
        : requests.fetchMovieVideos(item.id);

    const res = await movieInstance.get(endpoint);
    const videos = res.data.results || [];

    const trailer =
      videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
      videos.find((v) => v.site === "YouTube" && v.type === "Teaser") ||
      videos.find((v) => v.site === "YouTube");

    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("Trailer fetch failed:", err);
    return null;
  }
}
