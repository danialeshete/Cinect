import "./Profile.css";
import "../App.css";

import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Button, Row, Col, Stack, Modal, Form } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import SearchBar from "../search/SearchBar";
import UserCard from "./UserCard";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import CinectUserContext from '../common/CinectUserContext';
import getUserProfile from '../common/getUserProfile';
import MediaListPersonalProfile from "../mediaContent/MediaListPersonalProfile";
import getUserLibrary from "../common/getUserLibrary";
import LibraryContext from "../common/LibraryContext";
import ProfileDescription from "./ProfileDescription"
import getProfilePicture from "../common/getProfilePicture";
import ProfileUserName from "./ProfileUserName";
import DiscussionListContext from "../common/DiscussionListContext";
import UserComments from "./UserComments";


const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [cinectUser, setCinectUser, refreshLibraryUser] = useContext(CinectUserContext);
  const [library] = useContext(LibraryContext);
  const [userProfile, setUserProfile] = useState();
  const [userProfilePicture, setUserProfilePicture] = useState('/profile-pic-placeholder.png');
  const [userLibrary, setUserLibrary] = useState();
  const [discussionList, setDiscussionList] = useState({});
  const [discussionListRefreshIndex, setDiscussionListRefreshIndex] = useState(0);
  const { profileUsername } = useParams();
  const [show, setShow] = useState(false);
  const [fileName, setFileName] = useState("");

  const isOwnProfile = (profileUsername === undefined || profileUsername === 'me');


  const setUserProfileAsync = async (profile) => {
    setUserProfile(await profile);
  };
  const setUserLibraryAsync = async (profile) => {
    setUserLibrary(await profile);
  };

  const refreshDiscussionList = () => {
    setDiscussionListRefreshIndex(discussionListRefreshIndex + 1);
  }

  const handleClose = () => setShow(false);

  const handleShow = () => {
    if (isOwnProfile) {
      console.log("showing")
      setShow(true);
    }
  }

  const confirmPictureChange = async () => {
    const audience = `${process.env.REACT_APP_SERVER}`;
    const fileInput = document.querySelector('#formFileSm');
    const formData = new FormData();
    formData.append('picture', fileInput.files[0]);
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });
    const options = {
      method: 'POST',
      body: formData,
      headers: {
        // Add the Authorization header to the existing headers
        // 'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(fileInput.files[0])
    const url = `${process.env.REACT_APP_SERVER}/user/me/picture`;
    fetch(url, options);
    handleClose();
    refreshLibraryUser();
  }

  useEffect(() => {
    if (isOwnProfile) {
      setUserProfile(cinectUser);
      setUserLibrary(library);
    }
  }, [cinectUser, library, profileUsername]);

  useEffect(() => {
    if (!isOwnProfile) {
      const profilePromise = getUserProfile(profileUsername);
      const libraryPromise = getUserLibrary(profileUsername);
      setUserProfileAsync(profilePromise);
      setUserLibraryAsync(libraryPromise);
    }
  }, [cinectUser, profileUsername]);

  useEffect(() => {
    const setUserProfilePictureAsync = async (username) => {
      setUserProfilePicture(await getProfilePicture(username));
    }

    if (userProfile?.username !== undefined) {
      setUserProfilePictureAsync(userProfile?.username);
    }
  }, [userProfile]);

  return (
    <div className="content">
      <HelmetProvider>
        <Helmet>
          <title>{`Cinect - ${userProfile?.username}`}</title>
        </Helmet>
        <SearchBar />
        {isAuthenticated && (

          <Container className="pb-4">
            <Row className="justify-content-center">
              <Col xs={12} lg={12}>
                <div className="content-card">
                  <Row>
                    <Col xs={3} sm={2}>
                      <div onClick={handleShow} className={`profile-picture-wrapper${isOwnProfile ? " upload-image" : ""}`}>
                        <img onClick={handleShow} src={userProfilePicture} alt={user.name} />
                      </div>
                    </Col>
                    <Col xs={9} sm={10} className="d-md-none my-auto">
                      <ProfileUserName username={userProfile?.username} isOwnProfile={isOwnProfile} />
                    </Col>
                    <Col xs={12} sm={10} className="mt-3">
                      <div className="d-none d-md-block">
                        <ProfileUserName username={userProfile?.username} isOwnProfile={isOwnProfile} />
                      </div>
                      <ProfileDescription username={userProfile?.username} user_description={userProfile?.user_description} isOwnProfile={isOwnProfile} />

                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="mt-3">
                <MediaListPersonalProfile mediaList={userLibrary} slidesPerView={3} swiperRows={2} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={7} lg={8} className="mt-3">
                <DiscussionListContext.Provider value={[discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList]}>
                  <UserComments username={userProfile?.username}></UserComments>
                </DiscussionListContext.Provider>
              </Col>
              <Col xs={12} md={5} lg={4} className="mt-3">
                <div className="content-card">
                  <h2>Friends</h2>
                  <Stack gap={2}>

                    {userProfile?.friends?.map((friendElement, index) => (
                      <UserCard username={friendElement.username} key={index} />
                    ))}

                  </Stack>
                </div>
              </Col>
            </Row>
          </Container>
        )
        }
        <Modal className="dark text-light" show={show} onHide={handleClose} centered>
          <Modal.Header>
            <Modal.Title>Change your profile picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <Form.Group controlId="formFileSm" className="mb-3 d-flex justify-content-center">
              <label htmlFor="formFileSm" className="d-flex">
                <div className="picture-upload-wrapper d-flex">
                  <div className="round-text-dependent picture-file-label bg-white text-dark ">Upload image</div>
                  <div className="round-text-dependent bg-white text-dark picture-file-name">{fileName}</div>
                </div>
              </label>
              <Form.Control onChange={() => setFileName(document.querySelector('#formFileSm')?.files[0]?.name)} type="file" accept="image/png" size="sm" hidden
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => confirmPictureChange()}>
              Save Profile Picture
            </Button>
          </Modal.Footer>
        </Modal>
      </HelmetProvider>
    </div>
  );

};

export default Profile;
