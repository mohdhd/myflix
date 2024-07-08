import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "../services/TMDB";
import genreOrCategoryReducer from "../features/currentGenreOrCategory";
import movieReducer from "../features/movie";
import userReducer from "../features/auth";
import messages from "../features/message";

const store = configureStore({
    reducer: {
        [tmdbApi.reducerPath]: tmdbApi.reducer,
        currentGenreOrCategory: genreOrCategoryReducer,
        movies: movieReducer,
        user : userReducer,
        messages: messages,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),
});

window.store = store;

export default store