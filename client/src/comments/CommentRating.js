import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';

const CommentRating = ({personal_rating}) => {
  let starDom = [];

  if (personal_rating > 0) {
    starDom = [...Array(personal_rating)].map((starEl, starIndex) => (
      <FontAwesomeIcon key={starIndex} icon={faStarSolid} />
    ));
  }

  if (personal_rating < 5) {
    starDom = [...starDom, [...Array(5 - personal_rating)].map((starEl, starIndex) => (
      <FontAwesomeIcon key={personal_rating + starIndex} icon={faStarRegular} />
    ))];
  }
  if (personal_rating === undefined) {
    starDom = [...Array(5)].map((starEl, starIndex) => (
      <FontAwesomeIcon key={starIndex} icon={faStarRegular} />
    ));
  }
  return (<div>{starDom}</div>);
};

export default CommentRating;
