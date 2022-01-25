import './MediaSearch.css'

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Container } from 'react-bootstrap';

import searchTmdb from '../common/searchTmdb';
import MediaList from '../mediaContent/MediaList';
import SearchBar from './SearchBar';

const MediaSearch = () => {
  const [tmdbResult, setTmdbResult] = useState([]);
  const { search } = useLocation();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(search)
  const page = urlParams?.get("page") === null ? 1 : Number(urlParams?.get("page"));

  const canLeft = page > 1;



  const navigatePageUp = () => {
    const newPage = page + 1;
    urlParams.set('page', newPage)
    const newPath = location.pathname.split('?')[0] + '?' + urlParams.toString();
    navigate(newPath);
  }

  const navigatePageDown = () => {
    if (canLeft) {
      const newPage = page - 1;
      urlParams.set('page', newPage)
      const newPath = location.pathname.split('?')[0] + '?' + urlParams.toString();
      navigate(newPath);
    }
  }

  const contentDom = (
    <div>
      <MediaList mediaList={tmdbResult} />
      <div className="d-flex justify-content-center">
        <FontAwesomeIcon className={canLeft ? "pagination" : "pagination inactive"} icon={faCircleChevronLeft} onClick={navigatePageDown} />
        <FontAwesomeIcon className={"pagination"} icon={faCircleChevronRight} onClick={navigatePageUp} />
      </div>

    </div>
  )
  useEffect(() => {
    searchTmdb({ query: urlParams?.get("query"), page: page }).then((res) => {
      let tempTmdbResult = [];
      for (let mediaResult of res.results) {

        if (mediaResult.media_type === 'person') continue;

        const parsedResult = {
          media_id: mediaResult.id,
          is_tv: mediaResult.media_type === "tv" ? true : false  //if tv dann nur movies anzeigen
        };
        tempTmdbResult = [...tempTmdbResult, parsedResult];
      }
      setTmdbResult([]);                                      //setter leeren um es wieder zu befüllen. weird aber was solls
      setTmdbResult(tempTmdbResult);
    });
  }, [search])

  return (
    <HelmetProvider>
      <div className="content">
        <Helmet>
          <title>{`Cinect - ${urlParams?.get("query")}`}</title>
        </Helmet>
        <SearchBar />
        <Container className='pb-4'>
          {urlParams?.get("query") != null && contentDom}
        </Container>
      </div>
    </HelmetProvider>
  )
}

export default MediaSearch
