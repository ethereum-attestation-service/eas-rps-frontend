import React from "react";
import Lottie from "react-lottie";
import animationData from "./assets/rps-home.json";
import {usePrivy} from "@privy-io/react-auth";
import styled from "styled-components";
import {useStore} from './useStore'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    height: 80vh;
    justify-content: space-between;
`;

const RoshamboText = styled.div`
    color: #272343;
    font-family: "Bangers";
    font-size: 5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 0.9;
    text-align: center;
    margin-top: -5rem;
`;

const Button = styled.div`
    background-color: #c8b3f5;
    border-radius: 8px;
    color: #1e1e1e;
    font-family: "Space Grotesk";
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: center;
    width: 369px;
    height: 73px;
    flex-shrink: 0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RoshamboHeader = styled.div`
    margin-top: -5rem;
    height: auto;
    overflow-clip: hidden;
    pointer-events: none;
`;
const Descriptor = styled.p`
    text-align: center;
`;

export default function Start() {
  const {login, ready} = usePrivy();
  const setLoggingIn = useStore((state) => state.setLoggingIn);

  return (
    <Container>
      <RoshamboHeader>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
        />
      </RoshamboHeader>
      <div>
        <RoshamboText>ROCK PAPER SCISSORS</RoshamboText>
        <Descriptor>The classic game, built on Attestations.</Descriptor>
      </div>
      {ready ? <Button onClick={
        () => {
          setLoggingIn(true)
          login()
        }
      }>
        Start Playing →
      </Button> : <Descriptor>Checking for connections...</Descriptor>}
    </Container>
  );
}
