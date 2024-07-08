// services/tmdbApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setMovies, setGenres, setMovieDetails, setActorDetails, setList, setRecommendations } from "../features/movie";

const tmdbApiKey = localStorage.getItem("tmdbKey");

const baseQuery = fetchBaseQuery({ baseUrl: "https://api.themoviedb.org/3" });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    return {
        error: true,
        message:"please check your API key"
        
    }
  } else if (result.data && args) {
    const { data } = result;
    if (args.includes("genre/movie/list")) {
      api.dispatch(setGenres(data.genres));
    } else if (args.includes("movie/")) {
      if (args.includes("append_to_response=videos,credits")) {
        const idURL = args.split("/")[2];
        const id = idURL.split("?")[0];
        api.dispatch(setMovieDetails({id, data }));
      } else if (args.includes("/recommendations")) {
        const id = args.split("/")[2];
        api.dispatch(setRecommendations({ id, data }));
      } else {
        api.dispatch(setMovies(data.results));
      }
    } else if (args.includes("discover/movie")) {
      api.dispatch(setMovies(data.results));
    } else if (args.includes("person/")) {
      const id = args.split("/")[2];
      api.dispatch(setActorDetails({ id, data }));
    } else if (args.includes("/account/")) {
      const [ , , listName, , accountId ] = args.split("/");
      api.dispatch(setList({ name: listName, data }));
    } else if (args.includes("search/movie")) {
      api.dispatch(setMovies(data.results));
    }
  }

  return result;
};

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: () => `genre/movie/list?api_key=${tmdbApiKey}`,
    }),
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, searchQuery }) => {
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
        }
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === "string") {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
        }
        if (genreIdOrCategoryName && typeof genreIdOrCategoryName === "number") {
          return `discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&api_key=${tmdbApiKey}`;
        }
        return `movie/popular?page=${page}&api_key=${tmdbApiKey}`;
      },
    }),
    getMovie: builder.query({
      query: (id) => `/movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`,
    }),
    getList: builder.query({
      query: ({ listName, accountId, sessionId, page }) => `/account/${accountId}/${listName}?api_key=${tmdbApiKey}&session_id=${sessionId}&page=${page}`,
    }),
    getRecommendations: builder.query({
      query: ({ movie_id, list }) => `/movie/${movie_id}/${list}?api_key=${tmdbApiKey}`,
    }),
    getActorDetails: builder.query({
      query: (id) => `person/${id}?api_key=${tmdbApiKey}`,
    }),
    getMoviesByActorId: builder.query({
      query: ({ id, page }) => `/discover/movie?with_cast=${id}&page=${page}&api_key=${tmdbApiKey}`,
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetListQuery,
  useGetRecommendationsQuery,
  useGetActorDetailsQuery,
  useGetMoviesByActorIdQuery,
} = tmdbApi;
