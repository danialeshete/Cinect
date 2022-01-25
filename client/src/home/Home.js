import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import SearchBar from '../search/SearchBar';
import TopMoviesAndSeries from './TopMoviesAndSeries';
import { Helmet, HelmetProvider } from 'react-helmet-async';


const Home = () => {
  return (
    <HelmetProvider>
      <div className="content">
        <Helmet>
          <title>Cinect - Home</title>
        </Helmet>
        <SearchBar />
        <Container className="pb-4">
          <Row>

            <Col>
              <TopMoviesAndSeries />
            </Col>
          </Row>
        </Container>
      </div>
    </HelmetProvider>
  )
}

export default Home
