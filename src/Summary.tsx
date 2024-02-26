import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useNavigate, useParams} from "react-router";
import {
  STATUS_PLAYER1_WIN,
  STATUS_PLAYER2_WIN,
  STATUS_UNKNOWN,
  addPlusIfPositive,
  baseURL,
  getGameStatus,
  CUSTOM_SCHEMAS,
  choiceToText,
  STATUS_INVALID,
} from "./utils/utils";
import {GameWithPlayersAndAttestations} from "./utils/types";
import axios from "axios";
import Page from "./Page";
import {
  AttestationShareablePackageObject,
  createOffchainURL,
} from "@ethereum-attestation-service/eas-sdk";
import {MaxWidthDiv} from "./components/MaxWidthDiv";
import Confetti from "react-confetti";
import PlayerCard from "./components/PlayerCard";
import {usePrivy} from "@privy-io/react-auth";

const easLogo = "/images/rps/easlogo.png";

type WonProps = { won: boolean };

const SummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
`;

const LineBreak = styled.div`
  height: 1px;
  background-color: rgba(57, 53, 84, 0.15);
  margin: 10px;
  width: 100%;
`;

type CentralProps = { central: boolean };

type VictoryMessageProps = { isBig: boolean } & WonProps & CentralProps;

const VictoryMessage = styled.div<VictoryMessageProps>`
  font-family: Ubuntu, serif;
  text-align: left;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: ${({won}) => (won ? "#00ebcf" : "#C8B3F5")};
  font-size: ${({isBig}) => (isBig ? "48px" : "26px")};
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: -0.85rem;
  padding: ${({isBig}) => (isBig ? "20px" : "0")};
`;

const Points = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: baseline;
`;

const PointsNum = styled.span<WonProps>`
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: ${({won}) => (won ? "#ff9f1c" : "#F582AE")};
    color: rgb(39, 35, 67);
    -webkit-text-stroke: 3px rgb(245, 130, 174);
    font-family: "Space Grotesk", serif;
    font-size: 75px;
    font-style: normal;
    font-weight: 700;
    text-shadow: 10px 10px 10px rgba(33, 28, 67, 0.25);
    line-height: normal;
`;

const PointsWord = styled.span`
    color: rgb(39, 35, 67);
    font-family: "Space Grotesk", serif;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const ResultContainer = styled(MaxWidthDiv)`
  border-radius: 10px;
  width: 100%;
  flex-shrink: 0;
  border: 1px solid rgba(57, 53, 84, 0.2);
  background: #fff;
  box-shadow: 10px 10px 25px 5px rgba(210, 201, 190, 0.25);
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  align-items: center;
`;

const BoxTitle = styled.div`
  color: #272343;
  text-align: center;
  font-family: "Space Grotesk", serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding: 20px;
`;

const StakeTitle = styled.div`
  color: rgba(39, 35, 67, 0.66);
  font-family: "Space Grotesk", serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const StakeBet = styled.div`
  color: #272343;
  font-family: "Space Grotesk", serif;
  font-size: 22px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const GameUID = styled.a`
  color: #272343;
  font-family: "Space Grotesk", serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow-wrap: anywhere;
  text-decoration: none;
`;

const AttestationTitle = styled.div`
  color: rgba(76, 58, 78, 0.9);
  font-family: "Space Grotesk", serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const GameUIDContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  margin: 20px;
`;

const Button = styled(MaxWidthDiv)`
  border-radius: 8px;
  border: 1px solid #ff8e3c;
  background: #ff8e3c;
  margin: 10px 0;
  cursor: pointer;
  color: #fff;
  text-align: center;
  font-family: Nunito, serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 34px; /* 188.889% */
  width: 100%;
  height: 71px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UnderlinedLink = styled.a`
  color: #272343;
  text-align: center;
  font-family: "Space Grotesk", serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  text-decoration-line: underline;
`;

const GameInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 15fr;
  width: 100%;
  align-items: center;
  justify-content: center;
  border-top: 1px solid rgba(57, 53, 84, 0.15);
`;

const VictoryMessageContainer = styled.div<CentralProps>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 0 2rem;
  flex-direction: column;
  max-width: 400px;
  ${({central}) => (central ? "align-items: center;" : "")}
`;

function Summary() {
  const [game, setGame] = useState<GameWithPlayersAndAttestations>();
  const [tick, setTick] = useState<number>(0);
  const {challengeId} = useParams();
  const {user} = usePrivy();
  const address = user?.wallet?.address;
  const navigate = useNavigate();

  const update = async () => {
    //query server for game status
    const gameRes = await axios.post<GameWithPlayersAndAttestations>(
      `${baseURL}/gameStatus`,
      {
        uid: challengeId,
      }
    );

    setGame(gameRes.data);
  };

  //watch for game updates

  useEffect(() => {
    update();
    setTimeout(() => {
      setTick(tick + 1);
    }, 5000);
  }, [tick]);

  const status = game ? getGameStatus(game) : STATUS_UNKNOWN;
  if (!game) return null;

  const gameAttestationObjects: AttestationShareablePackageObject[] =
    game.relevantAttestations.map((attestation) =>
      JSON.parse(attestation.packageObjString)
    );

  const attestationDescriptions = gameAttestationObjects.map((attestation) => {
    switch (attestation.sig.message.schema) {
      case CUSTOM_SCHEMAS.CREATE_GAME_CHALLENGE:
        return "Create Game";
      case CUSTOM_SCHEMAS.COMMIT_HASH:
        return "Player Move";
      case CUSTOM_SCHEMAS.FINALIZE_GAME:
        return "EAS Game Summary";
    }
  });

  const won =
    (address === game?.player1 && status === STATUS_PLAYER1_WIN) ||
    (address === game?.player2 && status === STATUS_PLAYER2_WIN);

  const eloChangeHappened = game?.eloChange1 > 0 || game?.eloChange2 > 0;

  return (
    <Page>
      <SummaryContainer>
        {won && (
          <Confetti
            recycle={false}
            numberOfPieces={2000}
            tweenDuration={10000}
            initialVelocityY={20}
          />
        )}
        <VictoryMessageContainer central={!eloChangeHappened}>
          {status === STATUS_UNKNOWN ? null : status === STATUS_INVALID ? (
            <VictoryMessage
              won={false}
              isBig={true}
              central={!eloChangeHappened}
            >
              Abandoned
            </VictoryMessage>
          ) : address === game?.player1 ? (
            <VictoryMessage
              won={status === STATUS_PLAYER1_WIN}
              isBig={!eloChangeHappened}
              central={!eloChangeHappened}
            >
              {status === STATUS_PLAYER1_WIN
                ? "You Won!"
                : status === STATUS_PLAYER2_WIN
                  ? "You Lost!"
                  : "It's a tie!"}
            </VictoryMessage>
          ) : address === game?.player2 ? (
            <VictoryMessage
              won={status === STATUS_PLAYER2_WIN}
              isBig={!eloChangeHappened}
              central={!eloChangeHappened}
            >
              {status === STATUS_PLAYER2_WIN
                ? "You Won!"
                : status === STATUS_PLAYER1_WIN
                  ? "You Lost!"
                  : "It's a tie!"}
            </VictoryMessage>
          ) : null}

          {(address === game?.player1 || address === game?.player2) &&
          eloChangeHappened ? (
            <Points>
              <PointsNum
                won={
                  (address === game?.player1 &&
                    status === STATUS_PLAYER1_WIN) ||
                  (address === game?.player2 && status === STATUS_PLAYER2_WIN)
                }
              >
                {addPlusIfPositive(
                  (address === game?.player1
                    ? game?.eloChange1
                    : game?.eloChange2) || 0
                )}
              </PointsNum>
              <div style={{width: 5}}/>
              <PointsWord>points</PointsWord>
            </Points>
          ) : null}
        </VictoryMessageContainer>
        <ResultContainer>
          {/*<BiArrowFromBottom color={"#000"} size={24} />*/}
          <BoxTitle>Game Result</BoxTitle>
          <LineBreak/>
          <PlayerCard
            address={game?.player1 || ""}
            score={choiceToText(game?.choice1 || 0)}
            overrideENSWith={"Player A"}
            style={{
              border: "none",
              boxShadow: "none",
              backgroundColor:
                status === STATUS_PLAYER1_WIN
                  ? "rgba(46, 196, 182, 0.33)"
                  : "#FFF",
            }}
            badges={
              game?.player1Object.whiteListAttestations.map(
                (att) => att.type
              ) || []
            }
            ens={game?.player1Object.ensName}
            ensAvatar={game?.player1Object.ensAvatar}
          />
          <PlayerCard
            address={game?.player2 || ""}
            score={choiceToText(game?.choice2 || 0)}
            overrideENSWith={"Player B"}
            style={{
              border: "none",
              boxShadow: "none",
              backgroundColor:
                status === STATUS_PLAYER2_WIN
                  ? "rgba(46, 196, 182, 0.33)"
                  : "#FFF",
            }}
            badges={
              game?.player2Object.whiteListAttestations.map(
                (att) => att.type
              ) || []
            }
            ens={game?.player2Object.ensName}
            ensAvatar={game?.player2Object.ensAvatar}
          />
          {game?.stakes && (
            <>
              <LineBreak/>
              <StakeTitle>What was at stake...</StakeTitle>
              <StakeBet>{game?.stakes}</StakeBet>
              <LineBreak/>
            </>
          )}
        </ResultContainer>

        <ResultContainer>
          <BoxTitle> Game Attestations </BoxTitle>
          {gameAttestationObjects.map((attestation, index) => (
            <GameInfoContainer>
              <img
                src={easLogo}
                style={{width: 28, height: 28, display: "flex", margin: 20}}
              />
              <GameUIDContainer>
                <AttestationTitle>
                  {attestationDescriptions[index]}
                </AttestationTitle>
                <GameUID
                  href={`https://easscan.org${createOffchainURL(
                    attestation
                  )}`}
                  target="_blank"
                >
                  {attestation.sig.uid}
                </GameUID>
              </GameUIDContainer>
            </GameInfoContainer>
          ))}
        </ResultContainer>
        {address === game?.player1 || address === game?.player2 ? (
          <Button
            onClick={() => {
              navigate(
                `/${address === game?.player1 ? game?.player2 : game?.player1}`
              );
            }}
          >
            Rematch
          </Button>
        ) : null}
        <UnderlinedLink href={"/challenges"}>Back to Battles</UnderlinedLink>
      </SummaryContainer>
    </Page>
  );
}

export default Summary;
