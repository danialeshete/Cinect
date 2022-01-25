import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import MediaCard from './MediaCard';

// import Swiper core and required modules
//import { Navigation, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react.js';

// Import Swiper styles
import 'swiper/swiper.scss'; // core Swiper
import 'swiper/modules/navigation/navigation.scss'; // Navigation module
import 'swiper/modules/pagination/pagination.scss'; // Pagination module
import 'swiper/modules/scrollbar/scrollbar.scss';

import './MediaList.css';

import SwiperCore, {
  Grid, Pagination
} from 'swiper';

// install Swiper modules
SwiperCore.use([Grid, Pagination]);


const MediaList = ({ mediaList }, slidesPerView) => {
  return (
      <Row>
        <Col xs={12}>
          <div className="media-list">
            {(mediaList?.length !== undefined || mediaList?.length > 0) && // TODO: Test if 0 entries
              mediaList?.map(mediaElement => (
                <MediaCard media_id={mediaElement.media_id} media_type={mediaElement.is_tv ? "tv" : "movie"} />
              ))}
          </div>
        </Col>
      </Row>
  )
}

export default MediaList
