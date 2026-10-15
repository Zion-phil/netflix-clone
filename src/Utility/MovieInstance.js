import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; //use from .env

const movieInstance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export { movieInstance };

// https://api.themoviedb.org/3/discover/movie?api_key=e7a3707cbbedcd6e13610018c50a7534&with_genres=99
