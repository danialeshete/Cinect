import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserFollowButton from './UserFollowButton';
import getProfilePicture from '../common/getProfilePicture';


const UserCard = ({ username }) => {
  const [commentPicture, setCommentPicture] = useState("/profile-pic-placeholder.png");



  useEffect(() => {
    const setCommentPictureAsync = async () => {
      const pictureUrl = await getProfilePicture(username)
      setCommentPicture(pictureUrl);
    }

    setCommentPictureAsync()
  }, [username]);

  return (
    <div className="user-card d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center xs-col-gap">
        <div className="profile-picture-wrapper sm">
          <Link to={`/user/${username}`}>
            <img src={commentPicture} alt={username} />
          </Link>
        </div>
        <Link to={`/user/${username}`}>{username}</Link>
      </div>
      <UserFollowButton username={username} />

    </div>
  )
}

export default UserCard
