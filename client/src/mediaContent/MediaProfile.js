import React, { useContext, useEffect, useState } from 'react'
import getMediaMetadata from '../common/getMediaMetadata';

import "../App.css";
import './MediaCard.css';
import LibraryContext from '../common/LibraryContext';

import { useAuth0 } from "@auth0/auth0-react";
import getLibraryEntryLocal from '../common/getLibraryEntryLocal';
import removeLibraryEntry from '../common/removeLibraryEntry';
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from '../search/SearchBar';
import MediaCardProfile from './MediaCardProfile';
import MediaComments from '../mediaContent/MediaComments'
import MediaDetail from './MediaDetail'
import DiscussionListContext from '../common/DiscussionListContext';



const MediaProfile = ({ media_type }) => {
    const media_id = useParams().media_id;
    const [library, setLibrary] = useState([]);
    const [discussionList, setDiscussionList] = useState({});
    const [discussionListRefreshIndex, setDiscussionListRefreshIndex] = useState(0);

    const refreshDiscussionList = () => {
        setDiscussionListRefreshIndex(discussionListRefreshIndex + 1);
    }
    useEffect(() => {
    }, [discussionListRefreshIndex]);
    return (
        <DiscussionListContext.Provider value={[discussionList, setDiscussionList, discussionListRefreshIndex, refreshDiscussionList ]}>
            <div className="content">
                <SearchBar />
                <Container className="pb-4">
                    <Row>
                        <Col xs={12}>
                            <MediaCardProfile media_id={media_id} media_type={media_type} />
                        </Col>
                    </Row>
                    <Row >
                        <Col xs={12} md={6} className="mt-3">
                            <MediaComments media_id={media_id} media_type={media_type} />
                        </Col>
                        <Col xs={12} md={6} className="mt-3">
                            <MediaDetail media_id={media_id} media_type={media_type} />
                        </Col>

                    </Row>
                </Container>
            </div>
        </DiscussionListContext.Provider>
    )
}

export default MediaProfile
