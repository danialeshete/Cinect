import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap'


export default function FilmList({ movie }) {


  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path
          }`} alt={movie.title + " poster"} />
        <Card.Body>
          <Card.Title>{movie.title}</Card.Title>
          <Card.Text>
            <p>
              <small>RELEASE DATE: {movie.release_date}</small>
            </p>
            <p>
              <small>RATING: {movie.vote_average}</small>
            </p>
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </div >


  )
}
