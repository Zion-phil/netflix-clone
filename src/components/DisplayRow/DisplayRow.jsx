import React, { useEffect, useState } from "react";
import styles from "./DisplayRow.module.css";
import SlideShow from "./../SlideShow/SlideShow";
// import { movies } from "../../Data/Data";
import { movieInstance } from "../../Utility/MovieInstance";
import requests from "../../Utility/requestUrls";

function DisplayRow() {
  const [movies, setMovies] = useState({
    trending: [],
    netflixOriginals: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentaries: [],
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [
        trendingRes,
        netflixRes,
        topRatedRes,
        actionRes,
        comedyRes,
        horrorRes,
        romanceRes,
        docRes,
      ] = await Promise.all([
        movieInstance.get(requests.fetchTrending),
        movieInstance.get(requests.fetchNetflixOriginals),
        movieInstance.get(requests.fetchTopRatedMovies),
        movieInstance.get(requests.fetchActionMovies),
        movieInstance.get(requests.fetchComedyMovies),
        movieInstance.get(requests.fetchHorrorMovies),
        movieInstance.get(requests.fetchRomanceMovies),
        movieInstance.get(requests.fetchDocumentaries),
      ]);

      //  tag each item with media_type so MovieCard knows
      // whether to look up trailers on /movie/ or /tv/.
      setMovies({
        trending: trendingRes.data.results, // /trending/all already includes media_type
        netflixOriginals: netflixRes.data.results.map((m) => ({ ...m, media_type: "tv" })),
        topRated:         topRatedRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
        action:           actionRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
        comedy:           comedyRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
        horror:           horrorRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
        romance:          romanceRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
        documentaries:    docRes.data.results.map((m) => ({ ...m, media_type: "movie" })),
      });
    } catch (error) {
      console.error("unable to fetch movies", error);
    }
  };

  return (
    <div className={styles.mainWrapper}>
      <SlideShow title="Trending Movies" movies={movies.trending} />
      <SlideShow title="Popular on Netflix" movies={movies.netflixOriginals} />
      <SlideShow title="Action Movies" movies={movies.action} />
      <SlideShow title="Top Rated" movies={movies.topRated} />
    </div>
  );
}

export default DisplayRow;
