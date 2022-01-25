
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import SearchBar from './SearchBar';
import getUserSearch from '../common/getUserSearch'
import UserCard from '../profile/UserCard'

import "./UserSearch.css"

const UserSearch = () => {

  const { search } = useLocation();
  const urlParams = new URLSearchParams(search)
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const setUsersAsync = async () => {
      const response = await getUserSearch(urlParams?.get("query"));
      setUsers(response);
    };
    setUsersAsync();
  }, [urlParams?.get("query")]);

  useEffect(() => {
  }, [users]);

  return (
    <HelmetProvider>
      <div className="content">
        <Helmet>
          <title>{`Cinect - ${urlParams?.get("query")}`}</title>
        </Helmet>
        <SearchBar />
        <Container className='pb-4'>
          {users?.map((userEl) => (
            <Row className="mb-3 justify-content-center">
              <Col xs={12} className="user-list-element">
                <UserCard username={userEl.username} />
              </Col>
            </Row>
          ))}
        </Container>
      </div >
    </HelmetProvider>
  )
}

export default UserSearch
