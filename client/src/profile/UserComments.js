import React, { useState, useEffect, useContext } from 'react';
import Discussion from "../comments/Discussion";
import DiscussionListContext from "../common/DiscussionListContext";
import getUserDiscussions from '../common/getUserDiscussions';

const UserComments = ({ username }) => {
  const [discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList] = useContext(DiscussionListContext);

  const discussionFromData = (discussionData) => {
    const commentData = {
      username: discussionData.owner.username,
      personal_rating: discussionData.personal_rating,
      content: discussionData.content,
      is_review: discussionData.is_review,
      created: discussionData.created
    }
    return <Discussion 
    comment_id={discussionData.id} 
    commentData={commentData} 
    replies={discussionData.replies} 
    media_id={discussionData.referred_media}
    media_type={discussionData.is_tv ? "tv":"movie"}/>
  }

  useEffect(() => {
    if (username !== undefined) {
      const setDiscussionListAsync = async () => {
        const response = await getUserDiscussions(username);
        setDiscussionList([]);
        setDiscussionList(response);
      };

      setDiscussionListAsync();
    }
  }, [username, discussionListRefreshIndex]);
  return (
    <div className="content-card comments-body">
      <h2>Activity</h2>
      {(Object.keys(discussionList)?.length !== 0) &&
        discussionList?.map(discussionData => (
          discussionFromData(discussionData)
        ))}
      {!(Object.keys(discussionList)?.length !== 0) && username !== undefined &&
        <p>{username} doesn't have any comments yet!</p>}

    </div>
  )
};

export default UserComments;
