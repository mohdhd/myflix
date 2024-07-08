import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  IconButton,
  Toolbar,
  Drawer,
  Button,
  Avatar,
  useMediaQuery,
  Box
} from "@mui/material";
import {
  Menu,
  AccountCircle,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ColorModeContext } from "../../utils/ToggleColorMode";

import { setUser, userSelector } from "../../features/auth";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import { Link } from "react-router-dom";
import { fetchToken, createSessionId, moviesApi } from "../../utils";
import { Sidebar, Search } from "..";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  linkButton: {
    display: "flex",
    alignItems: "center",
  },
  drawerPaper: {
    width: 240,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: 240,
      flexShrink: 0,
    },
  },
}));

const NavBar = () => {
  const { isAuthenticated, user } = useSelector(userSelector);
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = useStyles();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const theme = useTheme();
  const dispatch = useDispatch();

  const colorMode = useContext(ColorModeContext);

  const token = localStorage.getItem("request_token");
  const sessionIdFromLocalStorage = localStorage.getItem("session_id");

  useEffect(() => {
    const logInUser = async () => {
      if (token) {
        if (sessionIdFromLocalStorage) {
          const { data: userData } = await moviesApi.get(
            `/account?session_id=${sessionIdFromLocalStorage}`
          );
          dispatch(setUser(userData));
        } else {
          const sessionId = await createSessionId();
          const { data: userData } = await moviesApi.get(
            `/account?session_id=${sessionId}`
          );

          dispatch(setUser(userData));
        }
      }
    };
    logInUser();
  }, [token, dispatch, sessionIdFromLocalStorage]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              style={{ outline: "none" }}
              onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              className={classes.menuButton}
            >
              <Menu />
            </IconButton>
          )}

            {isMobile && <Search isMobile={isMobile} />}


          {!isMobile && <div /> }
         
          
          {!isMobile && <Search  isMobile={isMobile} />}

         

          <Box sx={{ display: 'flex' }}>
          <IconButton
            color="inherit"
            onClick={colorMode.toggleColorMode}
          >
            {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

            {!isAuthenticated ? (
              <Button color="inherit" onClick={fetchToken}>
                {!isMobile && "Login"}&nbsp; <AccountCircle />
              </Button>
            ) : (
              <Button
                color="inherit"
                component={Link}
                to={`/profile/${user.id}`}
                className={classes.linkButton}
                onClick={() => {}}
              >
                {!isMobile && <>My Movies &nbsp;</>}
                <Avatar
                  style={{ width: 30, height: 30 }}
                  alt="Profile"
                  src={`https://www.themoviedb.org/t/p/w64_and_h64_face${user?.avatar?.tmdb?.avatar_path}`}
                />
              </Button>
            )}

            
          </Box>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          anchor="left"
          open={mobileOpen || !isMobile}
          onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{ keepMounted: true }}
        >
          <Sidebar setMobileOpen={setMobileOpen} />
        </Drawer>
      </nav>
    </>
  );
};

export default NavBar;
