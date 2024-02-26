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

export default function AwaitingSignerMessage() {
  return (
    <Container>
      Awaiting Signer Connection...
    </Container>
  )
}
