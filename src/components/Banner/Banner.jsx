import React, { useEffect, useState } from "react";
import NetflixBannerLogo from "../../assets/image/logo.png";
import { Play, Info } from "lucide-react";
import styles from "./Banner.module.css";
import { movieInstance } from "../../Utility/MovieInstance";
import requests from "../../Utility/requestUrls";

const BANNER_BASE = "https://image.tmdb.org/t/p/original/";

function Banner() {
  const [bannerImage, setBannerImage] = useState({});
  const [trailerKey, setTrailerKey] = useState(null);     // YouTube video ID
  const [showTrailer, setShowTrailer] = useState(false);  // modal open/close

  // Fetch a random Netflix Original for the banner (runs once on mount)
  useEffect(() => {
    async function fetchBanner() {
      try {
        const request = await movieInstance.get(requests.fetchNetflixOriginals);
        const movies = request.data.results;
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        setBannerImage(randomMovie);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBanner();
  }, []);

  // Fetch the trailer whenever the banner show changes.
  // Guard clause skips the first render (bannerImage is still empty {}).
  useEffect(() => {
    if (!bannerImage?.id) return;

    async function fetchTrailer() {
      try {
        // /tv/{id}/videos — banner shows are TV shows, so use /tv/ not /movie/
        const res = await movieInstance.get(
          requests.fetchTvVideos(bannerImage.id)
        );
        const videos = res.data.results || [];

        // Prefer an official Trailer; fall back to any YouTube video
        const trailer =
          videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          videos.find((v) => v.site === "YouTube");

        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error("Trailer fetch failed:", err);
        setTrailerKey(null);
      }
    }
    fetchTrailer();
  }, [bannerImage]);

  const handlePlay = () => {
    if (trailerKey) {
      setShowTrailer(true);
    } else {
      // No trailer on TMDB → fall back to a YouTube search
      const q = encodeURIComponent(bannerImage?.original_name || "trailer");
      window.open(`https://www.youtube.com/results?search_query=${q}`, "_blank");
    }
  };

  function truncate(str, n) {
    return str?.length ? str.substr(0, n - 1) + " ..." : str;
  }

  return (
    <div
      className={styles.banner}
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("${BANNER_BASE}${bannerImage.backdrop_path}")`,
      }}
    >
      <div className={styles.contents}>
        <img
          className={styles.logoImg}
          src={NetflixBannerLogo}
          alt="Netflix Logo"
        />
        <h1 className={styles.title}>{bannerImage?.original_name}</h1>
        <h1 className={styles.description}>
          {truncate(bannerImage?.overview, 120)}
        </h1>
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handlePlay}>
            <Play size={30} />
            Play
          </button>
          <button className={styles.button}>
            <Info size={30} />
            My List
          </button>
        </div>
      </div>

      <div className={styles.fadeButtom}></div>

      {/* Trailer modal — click overlay or ✕ to close */}
      {showTrailer && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTrailer(false)}
        >
          {/* stopPropagation prevents clicks inside the modal from closing it */}
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
