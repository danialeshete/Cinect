import React, { useContext, useEffect, useState } from 'react';
import { ToggleButton } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import CinectUserContext from '../common/CinectUserContext';

const UserFollowButton = ({ username }) => {
  const { getAccessTokenSilently } = useAuth0();
  const [cinectUser, setCinectUser, refreshLibraryUser] = useContext(CinectUserContext);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const isFollowing = cinectUser?.friends?.filter((friend) => {
    return friend.username === username
  }).length > 0;



  const toggleFollow = async () => {
    const audience = `${process.env.REACT_APP_SERVER}`;
    const url = `${process.env.REACT_APP_SERVER}/user/me/profile/friends?username=${username}`;
    const accessToken = await getAccessTokenSilently({
      audience: audience,
    });

    if (username !== cinectUser?.username) {
      if (isFollowing) {
        await fetch(url, {
          method: "DELETE",
          headers: {
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
          body: false,
        });
      } else {
        await fetch(url, {
          method: "PUT",
          headers: {
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
          body: false,
        });
      }
      refreshLibraryUser();
    }
    


  }



  return (
      <ToggleButton
          id={`toggle-check-${username}`}
          type="checkbox"
          variant="outline-primary"
          checked={isFollowing}
          value="1"
          onChange={toggleFollow}
          className="yellow"
        >
          {isFollowing ? "Unfollow ": "Follow"}
        </ToggleButton>
  )
};

export default UserFollowButton;
