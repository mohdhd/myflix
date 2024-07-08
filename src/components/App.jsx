import React, { useRef } from "react";
import { CssBaseline } from "@mui/material";
import { Route, Switch } from "react-router-dom";
import useStyles from "./styles";
import { useState,useEffect } from "react";

import Actors from "./Actors/Actors";
import NavBar from "./NavBar/NavBar";
import Movies from "./Movies/Movies";
import MovieInformation from "./MovieInformation/MovieInformation";
import Profile from "./Profile/Profile";
import MicButton  from "./MicButton";
import APIPopup from "./APIPopup";



const App = () => {
    const classes = useStyles();

    const [openAiKey, setOpenAiKey] = useState(localStorage.getItem("openAiKey"));
    const [tmdbKey, setTmdbKey] = useState(localStorage.getItem("tmdbKey"));
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!openAiKey || !tmdbKey) {
          setShowPopup(true);
        }
      }, [openAiKey, tmdbKey]);

      const handleClosePopup = () => {
        window.location.reload();
        
      };


    return (
        <div className={classes.root}>
            <CssBaseline />

            {showPopup ? null : <NavBar />}

            {showPopup ? (
        <APIPopup open={showPopup} onClose={handleClosePopup} />
      ) : (

            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Switch>
                    <Route exact path="/movie/:id">
                        <MovieInformation />
                    </Route>
                    <Route exact path="/actors/:id">
                        <Actors />
                    </Route>
                    <Route exact path={["/", "/approved"]}>
                        <Movies />
                    </Route>
                    <Route exact path="/profile/:id">
                        <Profile />
                    </Route>
                    

                </Switch>
            </main> 
            )}
            <div />

            <MicButton />
        </div>
    );
};

export default App;
