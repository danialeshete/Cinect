import React from 'react'
import { Container, Row } from 'react-bootstrap';
import SearchFilmlist from './SearchFilmlist';

const Home = () => {
  return (
    <Container>
      <Row>
        <SearchFilmlist />
      </Row>
    </Container>
  )
}

export default Home
