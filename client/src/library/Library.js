import React, { useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import LibraryContext from '../common/LibraryContext';
import searchTmdb from '../common/searchTmdb';
import { Container } from 'react-bootstrap';

import MediaList from '../mediaContent/MediaList';
import SearchBar from "../search/SearchBar";

import './Library.css';
import WatchlistFilterToggle from './WatchlistFilterToggle';

const Library = () => {
  const [library] = useContext(LibraryContext);
  const { search } = useLocation();
  const [filterMatch, setFilterMatch] = useState([]);
  const [tmdbResults, setTmdbResults] = useState([]);

  const urlParams = new URLSearchParams(search);
  const watchlistFilter = Number(urlParams?.get("watchlist")); // is 0 for all, 1 for only watchlist and 2 for only not watchlist


  const nPagesTmdbSearch = 10;

  const readyForTmdb = (urlParams?.get("query") !== null && library?.length !== undefined)

  let nPagesObtained = 0;

  async function* asyncPageNumGenerator() {
    let i = 1;
    while (i < nPagesTmdbSearch + 1) {
      yield i++;
    }
  }

  /* Gets tmdb results in parallel, so that we can get multiple (nPagesTmdbSearch) pages 
   * without slow loops
   */
  async function setFilterMatchAsync() {
    let tempRawTmdbResults = []
    const asyncSetterHelper = async (pageNum) => {
      const pageResult = await searchTmdb({ query: urlParams?.get("query"), page: pageNum });
      tempRawTmdbResults.push(...pageResult.results);
      fireIfDone(tempRawTmdbResults);
    }
    for await (let pageNum of asyncPageNumGenerator()) {
      asyncSetterHelper(pageNum);
    }
  }

  /* Removes all non-media results from TMDB results array
   */
  const cleanUpTmdbResults = (tmdbResults) => {
    let validResults = [];
    for (let mediaResult of tmdbResults) {

      if (mediaResult.media_type === 'person') continue;

      const parsedResult = {
        media_id: mediaResult.id,
        is_tv: mediaResult.media_type === "tv" ? true : false
      };
      validResults = [...validResults, parsedResult];
    }
    return validResults;
  }

  const filterForWatchlist = (mediaList) => {
    switch (watchlistFilter) {
      case 0:
        return mediaList;
      case 1:
        return mediaList?.filter((mediaEl) => {
          return (mediaEl?.watched == false);
        })
      case 2:
        return mediaList?.filter((mediaEl) => {
          return mediaEl?.watched;
        })
    }

  }

  const fireIfDone = (tempRawTmdbResults) => {
    nPagesObtained++;
    if (nPagesObtained == nPagesTmdbSearch) {
      setTmdbResults(cleanUpTmdbResults(tempRawTmdbResults));
    }
  }

  useEffect(() => {
    if (readyForTmdb) {
      setFilterMatchAsync();
    } else {
      setFilterMatch(filterForWatchlist(library));
    }
  }, [library, search])

  useEffect(() => {
    if (readyForTmdb) {
      let tempFilterMatch = library.filter(libraryEntry => {
        for (const tmdbResult of tmdbResults) {
          if (tmdbResult.media_id == libraryEntry.media_id && tmdbResult.is_tv === libraryEntry.is_tv) {
            return true;
          }
        }
        return false
      })
      tempFilterMatch = filterForWatchlist(tempFilterMatch);
      setFilterMatch([]);
      setFilterMatch(tempFilterMatch);
    }
  }, [tmdbResults, search])

  return (
      <div className="content">
        <SearchBar />
        <div className="d-flex justify-content-center mb-3">
          <WatchlistFilterToggle watchlistFilter={watchlistFilter}></WatchlistFilterToggle>
        </div>
        <Container className="pb-4">
          <MediaList mediaList={filterMatch} slidesPerView={3} swiperRows={4} />
        </Container>
      </div>
  )
}

export default Library
