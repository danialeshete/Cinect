import React from 'react'
import { Link, NavLink, useLocation } from "react-router-dom";
import { Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as faBookmarkSolid, faHome, faUser, faClapperboard, faUpDownLeftRight } from '@fortawesome/free-solid-svg-icons';
import SvgCinectLogoVertical from '../images/SvgCinectLogoVertical';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import './Navigation.css';


const Navigation = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);


  let highlightLibrary = false;
  let highlightWatchlist = false
  if (location.pathname.startsWith('/library')) {
    const watchlistFilter = Number(urlParams?.get("watchlist")); // is 0 for all, 1 for only watchlist and 2 for only not watchlist

    if (watchlistFilter === 0 || watchlistFilter === 2) {
      highlightLibrary = true;
    } else {
      highlightWatchlist = true
    }
  }
  if (location.pathname.startsWith('/movie') || location.pathname.startsWith('/tv')) {
    highlightLibrary = true;
  }

  return (
    <HelmetProvider>
      <div className="nav-wrapper d-flex justify-content-center flex-md-column flex-shrink-0 dark">
        <Helmet>
          {highlightLibrary && <title>Cinect - Library</title>}
          {highlightWatchlist && <title>Cinect - Watchlist</title>}
        </Helmet>
        <div className="d-none d-md-flex justify-content-center mt-4">
          <Link to="/">
            <SvgCinectLogoVertical className="cinect-logo-vertical" />
          </Link>
        </div>
        <Nav className="nav-pills flex-row flex-md-column text-center justify-content-center">
          <NavLink to="/"><FontAwesomeIcon icon={faHome} /></NavLink>
          <Link className={highlightLibrary ? 'active' : ""} to="/library"><FontAwesomeIcon icon={faClapperboard} /></Link>
          <Link className={highlightWatchlist ? 'active' : ""} to="/library?watchlist=1"><FontAwesomeIcon icon={faBookmarkSolid} /></Link>
          <NavLink className={location.pathname.startsWith('/find/users') ? 'active' : ""} to="/user"><FontAwesomeIcon icon={faUser} /></NavLink>
        </Nav>
      </div>
    </HelmetProvider>
  )
}

export default Navigation
