import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap'


export default function SeriesList({ series }) {


  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w185_and_h278_bestv2/${series.poster_path
          }`} alt={series.title + " poster"} />
        <Card.Body>
          <Card.Title>{series.title}</Card.Title>
          <Card.Text>
            <p>
              <small>RELEASE DATE: {series.release_date}</small>
            </p>
            <p>
              <small>RATING: {series.vote_average}</small>
            </p>
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </div >


  )
}
