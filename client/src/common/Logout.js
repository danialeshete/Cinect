import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button size="sm" onClick={() => logout({ returnTo: window.location.origin })}>
            <FontAwesomeIcon icon={faRightFromBracket}/>
    </Button>
  );
};

export default LogoutButton;