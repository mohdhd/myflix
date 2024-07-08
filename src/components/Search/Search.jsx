import React, { useState, useEffect } from "react";
import { TextField, InputAdornment, Input } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import useStyles from "./styles";
import { searchMovie } from "../../features/currentGenreOrCategory";

const Search = ({isMobile}) => {
    const classes = useStyles();
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const location = useLocation();

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            dispatch(searchMovie(query));
        }
    };

    if (location.pathname !== "/") return null;
    return (
        <div className={classes.searchContainer}>
            <TextField
                onKeyPress={handleKeyPress}
                value={query}
                size="small"
                placeholder="Search for a movie..."
                fullWidth={true}
                style={(isMobile) ? {width: "230px",marginTop:20} : {width: "500px"}}
                onChange={(e) => setQuery(e.target.value)}
                variant="outlined"
                InputProps={{
                    className: classes.input,
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
        </div>
    );
};

export default Search;
