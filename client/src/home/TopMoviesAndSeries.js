import React, { useState, useEffect } from "react";
import MediaCard from '../mediaContent/MediaCard';
import { Container, Row, Col, ToggleButtonGroup } from 'react-bootstrap';
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

// Import Swiper styles
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import 'swiper/modules/scrollbar/scrollbar.scss';

import './TopMoviesAndSeries.css';


export default function TopMoviesAndSeries() {


  //create the state for movies, and update that state appropriate
  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);

  const swiperBreakpoints = {
    520: {
      slidesPerView: 2,
      spaceBetween: 40
    },
    576: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 20
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 20
    },
    1400: {
      slidesPerView: 6,
      spaceBetween: 20
    }
  };
  //APIKEY
  const tmdbKey = 'a17868a3f193d9c0a73347ea56fa0e16';

  //async fetch movielist
  useEffect(() => {
    const fetchMoviesList = async () => {

      const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbKey}&language=en-US&page=1`);
      const json = await res.json();
      setMoviesList(json.results);
    }; fetchMoviesList();
  }, []);

  //async fetch SeriesList
  useEffect(() => {
    const fetchSeriesList = async () => {

      const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${tmdbKey}&language=en-US&page=1`);
      const json = await res.json();
      setSeriesList(json.results);
    }; fetchSeriesList();
  }, []);


  return (
    <div>
      <Row>
        <Col>
          <h1>New Movies</h1>
          <div className="swiper-container">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              slidesPerView={2}
              loopFillGroupWithBlank={true}
              navigation
              scrollbar={{ draggable: true }}
              spaceBetween={10}
              breakpoints={swiperBreakpoints}
            >
              {(moviesList?.length !== undefined || moviesList?.length > 0) && // TODO: Test if 0 entries
                moviesList?.slice(0, 10).map(mediaElement => (
                  <SwiperSlide><MediaCard media_id={mediaElement.id} media_type={"movie"} /></SwiperSlide>

                ))}
            </Swiper>

          </div>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h1>What's on TV</h1>
          <div className="swiper-container">
            <Swiper
              // install Swiper modules
              modules={[Navigation, Pagination, Scrollbar, A11y]}
              slidesPerView={2}
              loopFillGroupWithBlank={true}
              navigation
              scrollbar={{ draggable: true }}
              spaceBetween={10}
              breakpoints={swiperBreakpoints}
            >
              {(seriesList?.length !== undefined || seriesList?.length > 0) && // TODO: Test if 0 entries
                seriesList?.slice(0, 10).map(mediaElement => (
                  <SwiperSlide><MediaCard media_id={mediaElement.id} media_type={"tv"} /></SwiperSlide>

                ))}
            </Swiper>
          </div>
        </Col>
      </Row>

    </div >
  )
};



