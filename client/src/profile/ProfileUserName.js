import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal, FloatingLabel, Form, Col } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';

import CinectUserContext from '../common/CinectUserContext';
import setOwnUserProfile from '../common/setOwnUserProfile';
import UserFollowButton from './UserFollowButton';
import LogoutButton from '../common/Logout';


const ProfileUserName = ({ username, isOwnProfile }) => {
  const [profile, setUserProfile, refreshUserProfile] = useContext(CinectUserContext);
  const { getAccessTokenSilently } = useAuth0();
  const [show, setShow] = useState(false);
  const [usernameInput, setUsernameInput] = useState(username);
  const audience = `${process.env.REACT_APP_SERVER}`;

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
  }

  const confirmUsername = async (newUsername) => {
    handleClose();
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    await setOwnUserProfile({ entryChanges: { username: newUsername }, accessToken: accessToken })
    refreshUserProfile();
  }
  // handle change event
  const handleChange = (e) => {
    e.preventDefault(); // prevent the default action
    setUsernameInput(e.target.value); // set name to e.target.value (event)
  };

  useEffect(() => {
    setUsernameInput(username)
  }, [username]);


  return <div>
    <Col xs={12} className="d-flex justify-content-between">
      <h1 className="height-1-2-em">{username}</h1>
      <div className="d-flex align-items-center">
        <div>
          {isOwnProfile ? (
            <div className="sm-col-gap d-flex">
              <Button className="mr-3" variant="primary" size="sm" onClick={handleShow}>
                <FontAwesomeIcon icon={faUserPen} />
              </Button>
              <LogoutButton />
            </div>
          ) :
            <UserFollowButton username={username} />
          }
        </div>
      </div>
    </Col>

    <Modal className="dark text-light" show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Change your username</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <Form.Control
          as="input"
          placeholder={username}
          value={usernameInput}
          onChange={handleChange}
          className="round-text-dependent"
        />

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => confirmUsername(usernameInput)}>
          Save Username
        </Button>
      </Modal.Footer>
    </Modal>
  </div>;
};

export default ProfileUserName;
