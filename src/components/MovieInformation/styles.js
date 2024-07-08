import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
    containerSpaceAround: {
        display: "flex",
        justifyContent: "space-around",
        margin: "10px 0 !important",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
            flexWrap: "wrap",
        },
    },
    poster: {
        borderRadius: "20px",
        boxShadow: "0.5em 1em 1em rgb(64,64,70)",
        width: "80%",
        [theme.breakpoints.down("md")]: {
            margin: "0 auto",
            width: "50%",
            // height: "350px",
        },
        [theme.breakpoints.down("sm")]: {
            margin: "0 auto",
            width: "100%",
            height: "350px",
            marginBottom: "30px",
        },
    },
    genresContainer: {
        margin: "10px 0 !important",
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
    },
    genreImage: {
        filter: theme.palette.mode === "dark" && "invert(1)",
        marginRight: "10px",
    },
    links: {
        display: "flex",
        justifyContent: "center",
        textDecoration: "none",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            padding: "0.5rem 1rem",
        },
    },
    castImage: {
        width: "100%",
        maxWidth: "7em",
        height: "8rem",
        objectFit: "cover",
        borderRadius: "10px",
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        },
    },
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        width: "50%",
        height: "50%",
        [theme.breakpoints.down("sm")]: {
            width: "90%",
            height: "90%",
        },
    },
}));
