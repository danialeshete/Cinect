import React, { useContext, useState } from 'react';
import { Button, Modal, Form, Col } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import CinectUserContext from '../common/CinectUserContext';
import setOwnUserProfile from '../common/setOwnUserProfile';


const ProfileDescription = ({ username, user_description, isOwnProfile }) => {
  const [profile, setUserProfile, refreshUserProfile] = useContext(CinectUserContext);
  const { getAccessTokenSilently } = useAuth0();
  const [show, setShow] = useState(false);
  const [descriptionInput, setDescriptionInput] = useState(user_description);
  const audience = `${process.env.REACT_APP_SERVER}`;

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
  }

  const confirmDescription = async (newDescription) => {
    handleClose();
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    await setOwnUserProfile({ entryChanges: { user_description: newDescription }, accessToken: accessToken })
    refreshUserProfile();
  }
  // handle change event
  const handleChange = (e) => {
    e.preventDefault(); // prevent the default action
    setDescriptionInput(e.target.value); // set name to e.target.value (event)
  };


  return (
    <div>
      <Col xs={12}>
        {user_description}
      </Col>
      <Col xs={12} className="d-flex justify-content-end">
      {isOwnProfile ? <Button variant="primary" size="sm" onClick={handleShow}>Edit Description</Button> : <span></span>}
      </Col>
      <Modal className="dark text-light" show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title> Change your description</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Form.Control
            as="textarea"
            placeholder={user_description}
            style={{ height: '140px' }}
            value={descriptionInput}
            onChange={handleChange}
            className="round-text-dependent"
          />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => confirmDescription(descriptionInput)}>
            Save Description
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ProfileDescription
