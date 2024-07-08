import React from "react";
import { Typography, Button } from "@mui/material";
import useStyles from "./styles";

const Pagination = ({ currentPage, totalPages, setPage }) => {
    const classes = useStyles();

    const handlePrev = () => {
        if (currentPage != 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage != totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    if (totalPages === 0) return null;

    return (
        <div className={classes.container}>
            <Button
                onClick={handlePrev}
                className={classes.button}
                variant="contained"
                color="primary"
                type="button"
            >
                Prev
            </Button>
            <Typography variant="h4" className={classes.pageNumber}>
                {currentPage}
            </Typography>
            <Button
                onClick={handleNext}
                className={classes.button}
                variant="contained"
                color="primary"
                type="button"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
