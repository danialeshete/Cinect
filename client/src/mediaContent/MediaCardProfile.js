import React, { useContext, useEffect, useState } from 'react'
import getMediaMetadata from '../common/getMediaMetadata';
import { ToggleButton, Row, Col, Form, Button } from 'react-bootstrap';
import "../App.css";
import './MediaCardProfile.css';
import LibraryContext from '../common/LibraryContext';
import PersonalRating from './PersonalRating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faPaperPlane, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark as faCircleXmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkRegular, faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { useAuth0 } from "@auth0/auth0-react";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import getLibraryEntryLocal from '../common/getLibraryEntryLocal';
import removeLibraryEntry from '../common/removeLibraryEntry';
import setLibraryEntry from '../common/setLibraryEntry';
import DiscussionListContext from '../common/DiscussionListContext';
import postComment from '../common/postComment';


const MediaCardProfile = ({ media_id, media_type }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [library, setLibrary, refreshLibraryUser] = useContext(LibraryContext);
  const [discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList] = useContext(DiscussionListContext);
  const [mediaMetadata, setMediaMetadata] = useState({});
  const [localLibraryEntry, setLocalLibraryEntry] = useState(undefined);
  const [postAsReview, setPostAsReview] = useState(false)
  const [commentInput, setCommentInput] = useState("");
  const mediaPosterPath = mediaMetadata?.poster_path !== undefined && mediaMetadata?.poster_path !== null ? `https://image.tmdb.org/t/p/w500/${mediaMetadata.poster_path}`:"/poster-placeholder.svg";

  const media_title = mediaMetadata?.title !== undefined ? mediaMetadata?.title : mediaMetadata?.name;
  const audience = `${process.env.REACT_APP_SERVER}`;


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

  const handlePost = async () => {
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    await postComment({ media_id: media_id, is_review: postAsReview, is_tv: media_type === "tv", content: commentInput, accessToken: accessToken })
    setCommentInput("")
    refreshDiscussionList();
  }

  useEffect(() => {
    setLocalLibraryEntry(getLibraryEntryLocal(media_id, media_type, library));
    setMediaMetadataAsync();
  }, [library, media_id, media_type]);

  return (
    <HelmetProvider>
      <div className="media-card-profile content-card ">
        <Helmet>
          <title>{`Cinect - ${media_title}`}</title>
        </Helmet>
        <Row>
          <Col xs={12} s={5} md={3} className="d-flex justify-content-center align-items-start">
            <img className="poster" src={mediaPosterPath} />
          </Col>

          <Col xs={12} s={7} md={9}>
            <h1>{media_title}</h1>

            <div className="d-flex rating-section mb-1">
              <PersonalRating personal_rating={localLibraryEntry?.personal_rating} media_id={media_id} media_type={media_type} media_title={media_title} />
              <div className="d-flex align-items-center xxs-col-gap">
                <FontAwesomeIcon className="avg-rating-icon" icon={faUserGroup} />
                <div className="avg-rating-text">
                  {mediaMetadata.vote_average === undefined ? "-" : (mediaMetadata?.vote_average / 2).toFixed(1)}
                </div>
              </div>
            </div>
            <div className="d-flex xs-col-gap library-buttons mb-2">
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



            {mediaMetadata?.overview}

            <Form.Group className="mb-3">
              <Form.Label><h4> </h4></Form.Label>
              <Form.Control
                as="textarea"
                placeholder={`Write a comment for ${media_title}`}
                rows={3}
                className="mb-2 round-text-dependent"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <div className="comment-button-wrapper d-flex justify-content-end">
                <ToggleButton
                  id="toggle-check"
                  type="checkbox"
                  variant="outline-primary"
                  checked={postAsReview}
                  value="1"
                  onChange={(e) => setPostAsReview(e.currentTarget.checked)}
                  className="yellow"
                >
                  Mark as Review
                </ToggleButton>

                <Button onClick={handlePost} variant="light">Post <FontAwesomeIcon icon={faPaperPlane} /></Button>

              </div>
            </Form.Group>

          </Col>
        </Row>

      </div >
    </HelmetProvider>
  )
}

export default MediaCardProfile
