// @ts-nocheck
import './App.css';

import {
  Routes,
  Route
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Home from './home/Home';
import Library from './library/Library';
import Navigation from './common/Navigation';
import Profile from './profile/Profile';
import useApi from "./common/useApi";
import useScrollbarSize from 'react-scrollbar-size';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import LibraryContext from './common/LibraryContext';
import UserContext from './common/CinectUserContext';
import MediaSearch from './search/MediaSearch';
import MediaProfile from './mediaContent/MediaProfile';
import UserSearch from './search/UserSearch';

function App() {
  // Setting up global library and user state
  const [library, setLibrary] = useState([]);
  const [cinectUser, setCinectUser] = useState({});
  const { getAccessTokenWithPopup, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const { width: scrollbarWidth } = useScrollbarSize();

  const globalStyle = {
    "--scrollbar-width": `${scrollbarWidth}px`,
    "--side-nav-width": `65px`,
    "--card-height": `calc(40px + 1.5em + 1rem + 250px + 0.25rem + 1.5rem + 0.25rem + 1em + 0.5rem + 1rem)`
  };

  const opts = {
    audience: `${process.env.REACT_APP_SERVER}`
  };

  // get token protected data from API
  const { error, refresh: refreshLibraryUser, data: userBundleData } = useApi(
    `${process.env.REACT_APP_SERVER}/user/me/profile?library`,
    opts
  );

  // Library repopulates once on initial render (e.g. route change, reload)
  useEffect(() => {
    setCinectUser({
      username: userBundleData?.username,
      user_description: userBundleData?.user_description,
      friends: userBundleData?.friends
    });
    setLibrary(userBundleData?.library);
    const getTokenAndTryAgain = async () => {
      await getAccessTokenWithPopup(opts);
      refreshLibraryUser();
    };

    /** 
     * on localhost, the initial API request fails for security reasons. 
     * Try again after getting the explicit user permission via popup
     */
    if (error) {
      console.log(error)
      if (error.error === 'consent_required') {
        getTokenAndTryAgain();
      }
    }
  }, [userBundleData, error]);
  


  return (
    <HelmetProvider>
      <div className="app" style={globalStyle}>
        <Helmet>
          <title>Cinect</title>
        </Helmet>
        {!isAuthenticated && !isLoading && loginWithRedirect()}
        <LibraryContext.Provider value={[library, setLibrary, refreshLibraryUser]}> {/* LibraryContext wraps entire app */}
          <UserContext.Provider value={[cinectUser, setCinectUser, refreshLibraryUser]}> {/* UserContext wraps entire app */}
            <Navigation />
            <header className="app-header bg-dark text-light" >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/find/media" element={<MediaSearch />} />
                <Route path="/library" element={<Library />} />
                <Route path="/user" element={<Profile />} />
                <Route path="/user/:profileUsername" element={<Profile />} />
                <Route path="*" element={<Home />} />
                <Route path="/tv/:media_id" element={<MediaProfile media_type={"tv"} />} />
                <Route path="/movie/:media_id" element={<MediaProfile media_type={"movie"} />} />
                <Route path="/find/users" element={<UserSearch />} />
              </Routes>

            </header>
          </UserContext.Provider>
        </LibraryContext.Provider>
      </div>
    </HelmetProvider>
  );
}

export default App;
