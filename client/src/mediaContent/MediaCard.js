import React, { useContext, useEffect, useState } from 'react'
import getMediaMetadata from '../common/getMediaMetadata';

import "../App.css";
import './MediaCard.css';
import LibraryContext from '../common/LibraryContext';
import PersonalRating from './PersonalRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark as faCircleXmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useAuth0 } from "@auth0/auth0-react";
import getLibraryEntryLocal from '../common/getLibraryEntryLocal';
import removeLibraryEntry from '../common/removeLibraryEntry';
import setLibraryEntry from '../common/setLibraryEntry';
import { Link } from 'react-router-dom'



const MediaCard = ({ media_id, media_type }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [library, setLibrary, refreshLibraryUser] = useContext(LibraryContext);
  const [localLibraryEntry, setLocalLibraryEntry] = useState(undefined);
  const [mediaMetadata, setMediaMetadata] = useState({});

  let divStyle = {};
  const media_title = mediaMetadata?.title !== undefined ? mediaMetadata?.title : mediaMetadata?.name;
  const audience = `${process.env.REACT_APP_SERVER}`;

  if (mediaMetadata?.poster_path !== undefined) {
    divStyle = {
      backgroundImage: "url(https://image.tmdb.org/t/p/w500" + mediaMetadata.poster_path + ")",
      backgroundColor: "grey",
      backgroundSize: "cover",
    };
  };

  const setWatched = async (newValue) => {
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });

    await setLibraryEntry({ media_id: media_id, entryChanges: { watched: newValue }, is_tv: media_type === "tv", accessToken: accessToken })

    refreshLibraryUser();
  };

  const removeFromLibrary = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });

    await removeLibraryEntry(media_id, media_type === "tv", accessToken)
    refreshLibraryUser();
  };

  const setMediaMetadataAsync = async () => {
    const response = await getMediaMetadata(media_type, media_id);
    setMediaMetadata(response);
  };

  useEffect(() => {
    setLocalLibraryEntry(getLibraryEntryLocal(media_id, media_type, library));
  }, [library, media_id, media_type]);

  useEffect(() => {
    setMediaMetadataAsync();
  }, [media_id, media_type]);





  return (

    <div className="media-card content-card d-flex flex-column justify-content-center align-items-center text-center">
      <Link className="single-line-title mb-3" to={`/${media_type}/${media_id}/`} >
        {media_title}</Link>
      <div className="poster mb-1" style={divStyle}></div>

      <div className="d-flex align-items-center xxs-col-gap mb-1">
        <FontAwesomeIcon className="avg-rating-icon" icon={faUserGroup} />
        <div className="avg-rating-text">
          {mediaMetadata.vote_average === undefined ? "-" : (mediaMetadata?.vote_average / 2).toFixed(1)}
        </div>
      </div>
      <div className="mb-2">
        <PersonalRating personal_rating={localLibraryEntry?.personal_rating} media_id={media_id} media_type={media_type} media_title={media_title} />
      </div>
      <div className="d-flex xs-col-gap library-buttons">
        {localLibraryEntry === undefined &&
          <FontAwesomeIcon className="x-to-plus" onClick={() => { setWatched(true) }} icon={faCircleXmark} />
        }
        {localLibraryEntry !== undefined && localLibraryEntry.watched &&
          <FontAwesomeIcon onClick={() => { setWatched(false) }} icon={faBookmarkRegular} />
        }
        {localLibraryEntry !== undefined && !localLibraryEntry.watched &&
          <FontAwesomeIcon onClick={() => { setWatched(true) }} icon={faBookmarkSolid} />
        }
        {localLibraryEntry !== undefined &&
          <FontAwesomeIcon onClick={removeFromLibrary} icon={faCircleXmarkSolid} />
        }
      </div>

    </div>
  )
}

export default MediaCard
