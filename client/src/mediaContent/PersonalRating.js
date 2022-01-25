import React, { useContext, useState } from 'react';
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import setLibraryEntry from '../common/setLibraryEntry';
import { useAuth0 } from '@auth0/auth0-react';
import LibraryContext from '../common/LibraryContext';

import './PersonalRating.css';

const PersonalRating = ({ personal_rating, media_id, media_type, media_title }) => {
  const [library, setLibrary, refreshLibraryUser] = useContext(LibraryContext);
  const { getAccessTokenSilently } = useAuth0();
  const [show, setShow] = useState(false);
  const [tempRating, setTempRating] = useState(personal_rating);

  const audience = `${process.env.REACT_APP_SERVER}`;

  const handleClose = () => setShow(false);

  const handleShow = (initialRating) => {
    setTempRating(initialRating);
    setShow(true);
  }

  const clickRating = (newRating) => {
    setTempRating(newRating)
  }

  const confirmRating = async (newRating) => {
    handleClose();
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });

    await setLibraryEntry({ media_id: media_id, entryChanges: { personal_rating: newRating }, is_tv: media_type === "tv", accessToken: accessToken })
    refreshLibraryUser();
  }

  let starDomStd = [];

  if (personal_rating > 0) {
    starDomStd = [...Array(personal_rating)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { handleShow(starIndex + 1) }} key={starIndex} icon={faStarSolid} />
    ));
  }

  if (personal_rating < 5) {
    starDomStd = [...starDomStd, [...Array(5 - personal_rating)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { handleShow(personal_rating + starIndex + 1) }} key={personal_rating + starIndex} icon={faStarRegular} />
    ))];
  }
  if (personal_rating === undefined) {
    starDomStd = [...Array(5)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { handleShow(starIndex + 1) }} key={starIndex} icon={faStarRegular} />
    ));
  }

  let starDomModal = [];
  if (tempRating > 0) {
    starDomModal = [...Array(tempRating)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { clickRating(starIndex + 1) }} key={starIndex} icon={faStarSolid} />
    ));
  }

  if (tempRating < 5) {
    starDomModal = [...starDomModal, [...Array(5 - tempRating)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { clickRating(tempRating + starIndex + 1) }} key={tempRating + starIndex} icon={faStarRegular} />
    ))];
  }
  if (tempRating === undefined) {
    starDomModal = [...Array(5)].map((starEl, starIndex) => (
      <FontAwesomeIcon onClick={() => { clickRating(starIndex + 1) }} key={starIndex} icon={faStarRegular} />
    ));
  }
  return (
    <div className="d-flex align-items-center">
      <div className="d-flex rating-wrapper">
        {starDomStd}
      </div>
      <Modal className="dark text-light" show={show} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>Rate {media_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center align-items-center font-size-md rating-wrapper">
            {starDomModal}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={() => confirmRating(0)}>
            Remove Rating
          </Button>
          <Button variant="primary" onClick={() => confirmRating(tempRating)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PersonalRating
