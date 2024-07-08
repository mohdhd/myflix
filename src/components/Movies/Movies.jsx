import React, { useState, useEffect } from "react";
import {
    Box,
    CircularProgress,
    useMediaQuery,
    Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetMoviesQuery } from "../../services/TMDB";
import { MovieList, Pagination, FeaturedMovie } from "..";
import { searchMovie, selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { useDispatch } from "react-redux";

const Movies = () => {
    const [page, setPage] = useState(1);
    const { genreIdOrCategoryName, searchQuery } = useSelector(
        (state) => state.currentGenreOrCategory
    );
    const { data, error, isFetching } = useGetMoviesQuery({
        genreIdOrCategoryName,
        page,
        searchQuery,
    });

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    const g = params.get("g");
    const dispatch = useDispatch();


    useEffect(() => {
        if (q && q !== searchQuery) {
            dispatch(searchMovie(q));
        }

        console.log(g);
        if (g && g !== genreIdOrCategoryName) {

            dispatch(selectGenreOrCategory(Number(g)));
        }

        
    }, [g,q, searchQuery, dispatch]);

    const lg = useMediaQuery((theme) => theme.breakpoints.only("lg"));

    const numberOfMovies = lg ? 17 : 19;

    if (isFetching) {
        return (
            <Box display="flex" justifyContent="center">
                <CircularProgress size="4rem" />
            </Box>
        );
    }

    if (!data.results.length) {
        return (
            <Box display="flex" alignItems="center" mt="20px">
                <Typography variant="h4">
                    No Movies matching that name.
                    <br />
                    Please search for something else.
                </Typography>
            </Box>
        );
    }

    if (error) return "An error has occurred.";

    return (
        <div>
            <FeaturedMovie movie={data.results[0]} />
            <MovieList
                movies={data}
                numberOfMovies={numberOfMovies}
                excludeFirst
            />
            <Pagination
                currentPage={page}
                setPage={setPage}
                totalPages={data.total_pages}
            />
        </div>
    );
};

export default Movies;
