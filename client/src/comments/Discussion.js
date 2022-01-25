import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { Container, Row, Col, Button, InputGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply, faArrowDownWideShort, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from 'react-router-dom';

import DiscussionListContext from '../common/DiscussionListContext';
import DiscussionEntry from './DiscussionEntry';
import postReply from '../common/postReply';
import getMediaMetadata from '../common/getMediaMetadata';

import './Discussion.css'

const Discussion = ({ comment_id, commentData, replies, media_id, media_type }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList] = useContext(DiscussionListContext);

  const audience = `${process.env.REACT_APP_SERVER}`;

  const [discussionState, setDiscussionState] = useState({});
  const [showReplies, setShowReplies] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [mediaTitle, setMediaTitle] = useState(undefined);

  const submitReply = async (e) => {
    e?.preventDefault()
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    await postReply({ comment_id: comment_id, content: replyInput, accessToken: accessToken });
    refreshDiscussionList();
  }

  useEffect(() => {
    if (commentData !== undefined) {
      setDiscussionState({
        commentData: commentData,
        replies: replies
      })
    } else {
      // For future use if we want to get discussion by ID
    }
  }, []);

  useEffect(() => {
    if (media_id !== undefined && media_type !== undefined) {
      const setMediaTitleAsync = async () => {
        const response = await getMediaMetadata(media_type, media_id);
        setMediaTitle(response.title !== undefined ? response.title : response.name);
      };
      setMediaTitleAsync()
    }
  }, [media_id, media_type]);


  return (
    <div className={"discussion-wrapper" + (showReplies ? " expanded" : "")}>
      {mediaTitle !== undefined && (
        <Row className="mb-3">
          <Col xs={12}>
            <Link to={`/${media_type}/${media_id}`}>
              <h3>{mediaTitle}</h3>
            </Link>
          </Col>
        </Row>
      )}
      <Row className="main-comment">
        {Object.keys(discussionState).length !== 0 && (
          <Col>
            <DiscussionEntry
              username={discussionState?.commentData?.username}
              created={discussionState?.commentData?.created}
              personal_rating={discussionState?.commentData?.personal_rating}
              content={discussionState?.commentData?.content}
              comment_id={comment_id}
              isComment={true}
              is_review={discussionState?.commentData?.is_review}
            />
          </Col>
        )}
      </Row>
      <div className={showReplies && (discussionState?.replies?.length) ? "animate-expansion show" : "animate-expansion"}>
        {
          discussionState?.replies?.map(reply => (
            <Row className="mt-2 mb-2"><Col><DiscussionEntry
              username={reply.owner.username}
              created={reply.created}
              personal_rating={reply.personal_rating}
              content={reply.content}
              reply_id={reply.id}
            />
            </Col></Row>
          ))}
      </div>
      <Row>
        <Col>
          <InputGroup className="reply-controls">
            <Button className="show-hide-button" onClick={() => setShowReplies(!showReplies)} disabled={!(discussionState?.replies?.length > 0)}>
              {showReplies ? <FontAwesomeIcon icon={faArrowUpWideShort} /> : <FontAwesomeIcon icon={faArrowDownWideShort} />}
            </Button>
            <Form.Control
              as="textarea"
              placeholder={`Reply to ${commentData?.username}'s discussion`}
              rows={1} 
              onChange={(e) => setReplyInput(e.target.value)}
              className="reply-input"
            />
            <button onClick={submitReply} className="right-rounded-button"><FontAwesomeIcon icon={faReply} /></button>
          </InputGroup>
        </Col>
      </Row>
    </div>
  )
};

export default Discussion;
