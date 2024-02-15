import Lottie from "react-lottie";
import { CHOICE_PAPER, CHOICE_ROCK, CHOICE_UNKNOWN } from "../utils/utils";
import rockLottieOrange from "../assets/power-orange.json";
import paperLottieOrange from "../assets/paper-orange.json";
import scissorsLottieOrange from "../assets/scissors-orange.json";
import rockLottiePurple from "../assets/power-purple.json";
import paperLottiePurple from "../assets/paper-purple.json";
import scissorsLottiePurple from "../assets/scissors-purple.json";
import React from "react";
import styled from "styled-components";

type angleProps = { angle: number };
const LottieContainer = styled.div<angleProps>`
  width: 200px;
  height: 200px;
  transform: rotate(${({ angle }) => angle}deg);
`;

type Props = { choice: number; isPlayer1: boolean };
export default function RotatedLottie({ choice, isPlayer1 }: Props) {
  return (
    <LottieContainer angle={choice === CHOICE_ROCK ? -45 : 45}>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: isPlayer1
            ? choice === CHOICE_ROCK
              ? rockLottieOrange
              : choice === CHOICE_PAPER
              ? paperLottieOrange
              : scissorsLottieOrange
            : choice === CHOICE_ROCK
            ? rockLottiePurple
            : choice === CHOICE_PAPER
            ? paperLottiePurple
            : scissorsLottiePurple,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
      />
    </LottieContainer>
  );
}
