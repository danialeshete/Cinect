import React, {useContext} from "react";
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap'
import LibraryContext from '../common/LibraryContext';

export default function SeriesList({ media }) {

  const [library, setLibrary]= useContext(LibraryContext);

  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${media?.poster_path
          }`} alt={media?.title + " poster"} />
        <Card.Body>
          <Card.Title>{media?.title}</Card.Title>
          <Card.Text>
            <p>
              <small>RELEASE DATE: {media?.release_date}</small>
            </p>
            <p>
              <small>RATING: {media?.vote_average}</small>
            </p>
          </Card.Text>
          <Button onClick={() => {setLibrary("Emptied")}} variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </div >


  )
}
