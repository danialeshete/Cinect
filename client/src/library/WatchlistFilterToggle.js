import './WatchlistFilterToggle.css'

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import SvgBookmarkStriped from '../images/SvgBookmarkStriped';
import { useLocation, useNavigate } from 'react-router-dom';


const WatchlistFilterToggle = ({ watchlistFilter }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  const reroute = () => {
    urlParams.set('watchlist', (watchlistFilter + 1) % 3)
    const newPath = location.pathname.split('?')[0] + '?' + urlParams.toString();
    navigate(newPath);
  }

  let iconDom;

  switch (watchlistFilter) {
    case 0:
      iconDom = <SvgBookmarkStriped />;
      break;
    case 1:
      iconDom = <FontAwesomeIcon icon={faBookmarkSolid} />
      break;
    case 2:
      iconDom = <FontAwesomeIcon icon={faBookmarkRegular} />
      break;
  }

  return (
    <div>
      <button className="wrapper-button watchlist-filter d-flex justify-content-center align-items-center" onClick={reroute} >
        {iconDom}
      </button>
    </div>
  )
}

export default WatchlistFilterToggle
