import React, { useState, useEffect, useContext } from "react";
import Discussion from "../comments/Discussion";
import DiscussionListContext from "../common/DiscussionListContext";
import getMediaDiscussions from '../common/getMediaDiscussions';
import './MediaComments.css';

const MediaComments = ({ media_id, media_type }) => {
    const [discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList]  = useContext(DiscussionListContext);

    const discussionFromData = (discussionData) => {
        const commentData = {
            username: discussionData.owner.username,
            personal_rating: discussionData.personal_rating,
            content: discussionData.content,
            is_review: discussionData.is_review,
            created: discussionData.created
        }
        return <Discussion comment_id={discussionData.id} commentData={commentData} replies={discussionData.replies} />
    }


    useEffect(() => {
        const setDiscussionListAsync = async () => {
            const response = await getMediaDiscussions(media_id, media_type);
            setDiscussionList([]);
            setDiscussionList(response);
        };

        setDiscussionListAsync();
    }, [media_id, media_type, discussionListRefreshIndex]);


    return (
        <div className="content-card comments-body">
            <h2>Comments</h2>
            {(Object.keys(discussionList)?.length !== 0) &&
                discussionList?.map(discussionData => (
                    discussionFromData(discussionData)
                ))}
            {!(Object.keys(discussionList)?.length !== 0) &&
                <p>Be the first to comment!</p>}

        </div>
    )
}

export default MediaComments
