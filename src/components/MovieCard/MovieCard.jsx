import React, { useState } from "react";
import styles from "./MovieCard.module.css";

import { FaCirclePlay } from "react-icons/fa6";
import { BsPlusCircle } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";
import { IoIosArrowDropdownCircle } from "react-icons/io";

import { fetchTrailer } from "../../Utility/fetchTrailer";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function MovieCard({ movie }) {
  const genres = ["Adventure", "Action", "Thriller"];

  // Modal state + trailer key
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);

  // Play button handler — fetches trailer, opens modal
  const handlePlay = async (e) => {
    e.stopPropagation();
    const key = await fetchTrailer(movie);
    if (key) {
      setTrailerKey(key);
      setShowTrailer(true);
    } else {
      // No trailer on TMDB → YouTube search fallback
      const name = movie?.title || movie?.name || movie?.original_name || "trailer";
      const q = encodeURIComponent(name);
      window.open(`https://www.youtube.com/results?search_query=${q}`, "_blank");
    }
  };

  return (
    <div className={styles.cardWrapper}>
      <img
        className={styles.poster}
        src={`${IMAGE_BASE}${movie?.poster_path}`}
        alt=""
      />

      <div className={styles.hoverCard}>
        <img
          className={styles.hoverImage}
          src={`${IMAGE_BASE}${movie?.poster_path}`}
          alt=""
        />

        <div className={styles.badge}>Recently Added</div>

        <div className={styles.buttonRow}>
          {/* Play button — wrapped so it's clickable */}
          <button
            className={styles.iconBtn}
            onClick={handlePlay}
            aria-label="Play trailer"
          >
            <FaCirclePlay color="white" size={40} />
          </button>

          <BsPlusCircle className={styles.circleButton} color="white" size={40} />
          <GoCheckCircleFill className={styles.circleButton} color="white" size={40} />
          <IoIosArrowDropdownCircle
            className={`${styles.circleButtonSmall} ${styles.circleButton}`}
            color="white"
            size={40}
          />
        </div>

        <div className={styles.metaRow}>
          <span className={styles.tag}>U/A 16+</span>
          <span className={styles.tag}>Movie</span>
          <span className={styles.tag}>HD</span>
        </div>

        <div className={styles.genres}>
          {genres.map((genre, index) => (
            <span key={index}>
              {genre}
              {index < genres.length - 1 && <span className={styles.dot}>•</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowTrailer(false)}
        >
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

export default MovieCard;
