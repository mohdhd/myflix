// features/movieSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  genres: [],
  movieDetails: {},
  actorDetails: {},
  lists: {},
  recommendations: {},
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = [...state.movies, ...action.payload];
    },
    setGenres: (state, action) => {
      state.genres = [...state.genres, ...action.payload];
    },
    setMovieDetails: (state, action) => {
        state.movieDetails = { ...state.movieDetails, [action.payload.id]: action.payload.data };
    },
    setActorDetails: (state, action) => {
      state.actorDetails[action.payload.id] = action.payload.data;
    },
    setList: (state, action) => {
      state.lists[action.payload.name] = action.payload.data;
    },
    setRecommendations: (state, action) => {
      state.recommendations[action.payload.id] = action.payload.data;
    },
  },
});

export const {
  setMovies,
  setGenres,
  setMovieDetails,
  setActorDetails,
  setList,
  setRecommendations,
} = movieSlice.actions;

export default movieSlice.reducer;
