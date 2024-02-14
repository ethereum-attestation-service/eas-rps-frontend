import React from "react";
import Lottie from "react-lottie";
import animationData from "./assets/rps-home.json";
import { CustomConnectButton } from "./components/ui/CustomConnectKit";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: calc(100vh - 80px);
  justify-content: space-between;
`;

const styles = {
  wholeContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    padding: "20px",
    height: "80vh",
    justifyContent: "space-between",
  },
  fistsContainer: {},
  roshamboText: {
    color: "#272343",
    fontFamily: "Bangers",
    fontSize: "5rem",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 0.9,
    textAlign: "center" as "center",
    marginTop: "-5rem",
  },
  button: {
    backgroundColor: "#C8B3F5",
    borderRadius: "8px",
    color: "#1E1E1E",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "18px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    textAlign: "center" as "center",
    width: "369px",
    height: "73px",
    flexShrink: 0,
    border: "none", // Remove border
    cursor: "pointer", // Change cursor on hover
    display: "flex", // Use flexbox for center alignment
    justifyContent: "center", // Center content horizontally
    alignItems: "center", // Center content vertically
    textDecoration: "none", // Remove text decoration in case it's an <a> tag
  },
};

const RoshamboHeader = styled.div`
  margin-top: -5rem;
  height: auto;
`;
const Descriptor = styled.p`
  text-align: center;
`;

export default function Start() {
  const { login, user } = usePrivy();
  const { wallet } = usePrivyWagmi();
  console.log(user);

  return (
    <div style={styles.wholeContainer}>
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
        <div style={styles.roshamboText}>ROCK PAPER SCISSORS</div>
        <Descriptor>The classic game, built on Attestations.</Descriptor>
      </div>
      <div style={styles.button} onClick={login}>
        Start Playing →
      </div>
    </div>
  );
}
