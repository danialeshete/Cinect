import React from 'react'
import { Nav } from 'react-bootstrap'
import LoginButton from './Login';
import LogoutButton from './Logout';

import './Navigation.css';

const Navigation = () => {
  return (
    <div className="nav-wrapper d-flex justify-content-center flex-md-column flex-shrink-0 bg-light">
      <div className="logo d-none d-md-flex"> CINECT</div>
      <Nav className="nav-pills flex-row flex-md-column text-center justify-content-center">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/watchlist">Watchlist</Nav.Link>
        <Nav.Link href="/library">Library</Nav.Link>
        <Nav.Link href="/user">User</Nav.Link>
        <LoginButton></LoginButton>
        <LogoutButton></LogoutButton>
      </Nav>
    </div>
  )
}

export default Navigation
