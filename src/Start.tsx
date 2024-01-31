import React from "react";
import Lottie from "react-lottie";
import animationData from "./assets/rps-home.json";
import { CustomConnectButton } from "./components/ui/CustomConnectKit";

const styles = {
  wholeContainer: {
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#FFF7E0",
    height: "100vh",
  },
  fistsContainer: {},
  roshamboText: {
    color: "#272343",
    fontFamily: "Bangers",
    fontSize: "90px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
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

export default function Start() {
  return (
    <div style={styles.wholeContainer}>
      <div className="roshambo-header">
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
      </div>
      <div style={styles.roshamboText}>ROSHAMBO</div>
      <p>Eth-based rock paper scissors.</p>
      <CustomConnectButton
        style={styles.button}
        text={"Join the Battleground"}
      />
    </div>
  );
}
