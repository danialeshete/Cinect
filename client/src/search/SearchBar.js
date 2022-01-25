import './SearchBar.css';

import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Dropdown, InputGroup, FormControl, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate, Link } from "react-router-dom";

import SvgCinectLogoTwolines from '../images/SvgCinectLogoTwoLines';

const SearchBar = () => {
  const [searchSetting, setSearchSetting] = useState(0);
  const searchOptions = ['Media', 'Users', 'Library', 'Watchlist'];
  const navigate = useNavigate();
  const location = useLocation();



  const [input, setInput] = useState('');

  const submitSearch = (e) => {
    e?.preventDefault();

    if (searchSetting === 0) {
      navigate(`/find/media?query=${input}`);

    }

    if (searchSetting === 1) {
      navigate(`/find/users?query=${input}`);
    }

    if (searchSetting === 2) {
      const isOnLibraryPage = location.pathname.includes('library');
      const queryString = input?.length > 0 ? `?query=${input}` : '';
      if (isOnLibraryPage) {
        navigate(location.pathname + queryString); // if already on someones library page, stay there
      } else {
        navigate(`/library` + queryString); // if on any other page, navigate to own library
      }

    }
    if (searchSetting === 3) {
      const isOnLibraryPage = location.pathname.includes('library');
      const queryString = input?.length > 0 ? `?query=${input}&watchlist=1` : `?watchlist=1`;
      if (isOnLibraryPage) {
        navigate(location.pathname + queryString); // if already on someones library page, stay there
      } else {
        navigate(`/library` + queryString); // if on any other page, navigate to own library
      }

    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const watchlistFilter = Number(urlParams?.get("watchlist"));
    if (location.pathname.startsWith('/library')) {
      if (watchlistFilter === 1) {
        setSearchSetting(3);
      } else if (watchlistFilter === 0 || watchlistFilter === 2) {
        setSearchSetting(2);
      }
    } else if (location.pathname.startsWith('/find/users')) {
      setSearchSetting(1);
    } else if (location.pathname.startsWith('/user')) {
      setSearchSetting(1);
    }
  }, [location])

  return (
    <div className="mt-3 mb-3">
      <Container>

        <Row className="justify-content-center">
          <Col xs={12} className="d-flex xs-col-gap justify-content-center">
            <div className="d-flex justify-content-center d-md-none">
              <Link to="/">
                <SvgCinectLogoTwolines className="cinect-logo-twolines" />
              </Link>
            </div>
            <div className="search-bar-wrapper my-auto">
              <Form onSubmit={submitSearch}>
                <InputGroup >
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {searchOptions[searchSetting]}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => { setSearchSetting(0) }}>{searchOptions[0]}</Dropdown.Item>
                      <Dropdown.Item onClick={() => { setSearchSetting(1) }}>{searchOptions[1]}</Dropdown.Item>
                      <Dropdown.Item onClick={() => { setSearchSetting(2) }}>{searchOptions[2]}</Dropdown.Item>
                      <Dropdown.Item onClick={() => { setSearchSetting(3) }}>{searchOptions[3]}</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <FormControl onChange={(e) => setInput(e.target.value)} className="search-input" aria-label="Text input with dropdown button" />
                  <button onClick={submitSearch} className="right-rounded-button"><FontAwesomeIcon icon={faSearch} /></button>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default SearchBar
