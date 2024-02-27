import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    font-size: 20px;
`;

const Link = styled.div`
    color: #272343;
    font-family: "Space Grotesk";
    font-size: 18px;
    text-decoration: underline;
    cursor: pointer;
`;

export default function AwaitingSignerMessage() {
  return (
    <Container>
      Awaiting Signer Connection...
      <Link onClick={()=>{window.location.reload()}}>
        Taking too long? Click here to reinitialize connection.
      </Link>
    </Container>
  )
}
