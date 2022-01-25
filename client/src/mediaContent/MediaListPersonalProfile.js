import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import MediaCardPersonal from './MediaCardPersonal';

// import Swiper core and required modules
//import { Navigation, Scrollbar, A11y } from 'swiper';
import { Navigation, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide, } from 'swiper/react/swiper-react.js';

// Import Swiper styles
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import 'swiper/modules/scrollbar/scrollbar.scss';

import './MediaListPersonalProfile.css';

import SwiperCore, {
  Grid, Pagination
} from 'swiper';
import MediaCard from './MediaCard';

// install Swiper modules
SwiperCore.use([Grid, Pagination]);


const MediaListPersonalProfile = ({ mediaList }) => {
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
  return (
    <Row>
      <Col xs={12}>
        <div className="swiper-container">
          <Swiper
            // install Swiper modules
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={2}
            spaceBetween={10}
            loopFillGroupWithBlank={true}
            navigation
            scrollbar={{ draggable: true }}
            breakpoints={swiperBreakpoints}
          >
            {(mediaList?.length !== undefined || mediaList?.length > 0) && // TODO: Test if 0 entries
              mediaList?.map(mediaElement => (

                <SwiperSlide><MediaCard media_id={mediaElement.media_id} media_type={mediaElement.is_tv ? "tv" : "movie"} /></SwiperSlide>
              ))}
          </Swiper>
        </div>
      </Col>
    </Row>
  )
}

export default MediaListPersonalProfile
