import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Stack, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import getProfilePicture from '../common/getProfilePicture';
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import DiscussionListContext from '../common/DiscussionListContext';

import deleteDiscussion from '../common/deleteDiscussion';
import deleteReply from '../common/deleteReply';

import './DiscussionEntry.css'
import CommentRating from './CommentRating';
import CinectUserContext from '../common/CinectUserContext';

const DiscussionEntry = ({ username, created, personal_rating, content, comment_id, reply_id, isComment, is_review }) => {
  const [cinectUser] = useContext(CinectUserContext)
  const { getAccessTokenSilently } = useAuth0();
  const [discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList] = useContext(DiscussionListContext);
  const [commentPicture, setCommentPicture] = useState("/profile-pic-placeholder.png");
  const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric'};


  const handleDelete = async () => {
    const audience = `${process.env.REACT_APP_SERVER}`;
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    if (isComment === true) {
      await deleteDiscussion({ comment_id: comment_id, accessToken: accessToken })
    } else {
      await deleteReply({ reply_id: reply_id, accessToken: accessToken })
    }
    
    refreshDiscussionList()
  }

  useEffect(() => {
    const setCommentPictureAsync = async () => {
      const pictureUrl = await getProfilePicture(username)
      setCommentPicture(pictureUrl);
    }
    setCommentPictureAsync()
  }, [username]);

  return (
    <div>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center xs-col-gap">
          <Link to={`/user/${username}`}>
            <div className="profile-picture-wrapper discussion-entry-image">
              <img src={commentPicture} alt={username} />
            </div>
          </Link>
          <div className="flex-column">
            <div className="column-gap-20 d-flex align-items-center">
              <Link to={`/user/${username}`}>
                <h3>{username}</h3>
              </Link>
              {(is_review) && <div className="review-marker">Review</div>}
            </div>
            <div className="column-gap-20 d-flex align-items-end">
              <div className="timestamp">
                {new Date(created).toLocaleDateString("de-DE", dateOptions)}
              </div>
              <CommentRating personal_rating={personal_rating} />
            </div>
          </div>
        </div>
        {username === cinectUser.username && (
          <Button variant="danger" className="delete-button" onClick={handleDelete}><FontAwesomeIcon icon={faTrashCan} /></Button>
        )}
      </div>

      <p>{content}</p>
    </div>
  );
};

export default DiscussionEntry;
