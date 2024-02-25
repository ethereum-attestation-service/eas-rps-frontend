import styled from 'styled-components';
import {BiUserCheck, BiTrophy} from 'react-icons/bi';
import {FaRegHandRock, FaRegHandPaper, FaFlagCheckered} from 'react-icons/fa';
import {HiOutlineSparkles, HiOutlineUsers} from 'react-icons/hi';
import {MaxWidthDiv} from './components/MaxWidthDiv';
import { formatAttestationLongValueV2 } from './utils/utils';

const easLogo = '/images/rps/easlogo.png';
const lineSvg = '/images/rps/how-it-works-line.svg';


const FullPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
    background-image: none;
`;

const Title = styled.div`
    color: #1E1E1E;
    font-family: Ubuntu;
    font-size: 36px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 1rem 0;
`;

const TitleDescription = styled.div`
    color: #393554;
    text-align: center;
    font-family: Ubuntu;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 2rem;
`;

const StepContainer = styled(MaxWidthDiv)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    border-radius: 15px;
    background: #FFF;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    z-index: 1;
`;

const StepSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 7fr;
    margin-bottom: 1rem;
    width: 100%;
`;

const StepTitle = styled.div`
    color: #000;
    font-family: Ubuntu;
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin-bottom: 0.8rem;
`;

const StepContent = styled.div`
    color: #232343;
    font-family: Nunito;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 0.8rem;
`;

const StepFinePrint = styled.div`
    color: rgba(57, 53, 84, 0.66);
    font-family: Nunito;
    font-size: 10px;
    font-style: italic;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 0.8rem;
`;

const FooterContent = styled.div`
    color: rgba(39, 35, 67, 0.66);
    font-family: "Space Grotesk";
    font-size: 10px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const FooterLink = styled.a`
    color: #5578D1;
    font-family: "Space Grotesk";
    font-size: 10px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-decoration: none;
`;

const LineImg = styled.img`
    position: absolute;
    top: 0;
    height: 100%;
`;

const MainBody = styled.div`
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Gap = styled.div`
    height: 3rem;
`;

type StepProps = {
  Icon: React.FC;
  title: string; content: string;
  finePrint?: string;
  hasFooter: boolean;
  footerContent?: string;
  footerLink?: string;
  footerLinkText?: string;
};

function Step({Icon, title, content, finePrint, hasFooter, footerContent, footerLink, footerLinkText}: StepProps) {
  return (
    <StepContainer>
      <StepSection>
        <Icon/>
        <div>
          <StepTitle>{title}</StepTitle>
          {content.split('\n').map((text) => <StepContent>{text}</StepContent>)}
          {finePrint && finePrint.split('\n').map((text) => <StepFinePrint>{text}</StepFinePrint>)}
        </div>
      </StepSection>
      {hasFooter && <StepSection>
        <img src={easLogo} alt="EAS Logo" style={{width: "28px", height: "28px"}}/>
        <div>
          <FooterContent>{footerContent}</FooterContent>
          <FooterLink href={footerLink}>{footerLinkText}</FooterLink>
        </div>
      </StepSection>}
    </StepContainer>
  );
}

const steps: StepProps[] = [
  {
    Icon: BiUserCheck,
    title: "User Registration",
    content: "Choose your signup method using your own wallet or using an embedded wallet with Privy.",
    finePrint: "This is the wallet that will be used to sign the offchain attestations.",
    hasFooter: false,
  },
  {
    Icon: FaRegHandRock,
    title: "Starting a Challenge",
    content: "When a user starts a challenge, they are attesting to the recipient address they want to challenge." +
      "\n" +
      "Optionally, the challenger can add “stakes” which is just a string of what they are playing RPS for." +
      "\n" +
      "This commit generates a private offchain attestation that gets stored in our server.",
    hasFooter: true,
    footerContent: "Example Create Game Attestation",
    footerLink: "https://sepolia.easscan.org/offchain/attestation/view/0xd99d109a236f1821fec6fe9784b8d000a6395bf10357f96e78838a04df72afa3",
    footerLinkText: formatAttestationLongValueV2("0xd99d109a236f1821fec6fe9784b8d000a6395bf10357f96e78838a04df72afa3"),
  },
  {
    Icon: FaRegHandPaper,
    title: "Attesting to a Move",
    content: `Now that a game has been created, each player will see the “Active” or "Incoming" Game in the UI.\n` +
      "\n" +
      "They can then attest to their “Player Move” by selecting Rock, Paper, or Scissors. Once selected, they are prompted to sign the message. \n" +
      "\n" +
      "This generates an offchain attestation attesting to a hash of their move + a salt, referencing the Create Game attestation." +
      "\n" +
      "This attestation is public as soon as it is sent to the server. By making this attestation, the player is publicly committing to their move without " +
      "revealing it.",
    hasFooter: true,
    footerContent: "Example Player Move Attestation",
    footerLinkText: formatAttestationLongValueV2("0xdc83e58dd6940b816424f91ce974700870884d1a65b04633f18fee75f773678e"),
    footerLink: "https://sepolia.easscan.org/offchain/attestation/view/0xdc83e58dd6940b816424f91ce974700870884d1a65b04633f18fee75f773678e",
  },
  {
    Icon: FaFlagCheckered,
    title: "Revealing a Move",
    content: "Once both players have committed to their moves, they can reveal their moves. This is done by submitting the original move and salt to the server, thus making the information public. " +
      "\n" +
      "Once both players have revealed their moves, anyone can verify that the players' choices and salts match the hashes in their attestations" +
      " and determine the game's winner." +
      "\n" +
      "If a player does not reveal in time, the server acts as an authority and times the player out, causing a forfeit.",
    finePrint: "Although the server can time out a player, and the game's result will be displayed as such on RPS.sh, " +
      "the benefit of using attestations is that the game's result can be verified by any other third party or smart contract logic." +
      "\n" +
      "This means that the game's result can be used with no need to trust our server.",
    hasFooter: false,
  },
  {
    Icon: HiOutlineSparkles,
    title: "RPS Attests to Winners",
    content: "We attest to the game result and provide all relevant attestations in their game summary." +
      "\n" +
      "This includes relevant attestations, salts, and choices as a concise summary. It also includes" +
      "whether the server had to time out a player.",
    hasFooter: true,
    footerContent: "Example Game Summary Attestation",
    footerLink: "https://sepolia.easscan.org/offchain/attestation/view/0xdf752a2113f54c4c1e6386eba61305b0eb5bbb0b5089a449176c4c6a72196440",
    footerLinkText: formatAttestationLongValueV2("0xdf752a2113f54c4c1e6386eba61305b0eb5bbb0b5089a449176c4c6a72196440"),
  },
  {
    Icon: BiTrophy,
    title: "ELO Ratings Are Updated",
    content: "Our server adjusts the users ELO rating based on who they played and the result. This influences their spot on the leaderboard.",
    hasFooter: false,
  },
  {
    Icon: HiOutlineUsers,
    title: "Relative Game Graphs",
    content: "As the user plays more people, we begin to create a relative social graph of who they’ve played and who those people have played.",
    hasFooter: true,
    footerContent: "Check out your relative game graph here!",
    footerLink: "https://rps.sh/graph",
    footerLinkText: "View Graph",
  },
];

export default function HowItWorks() {
  return (<FullPageContainer>
    <Title>How It Works</Title>
    <TitleDescription>
      RPS uses a series of offchain attestations to play the game.
      Here’s how it works under the hood:
    </TitleDescription>

    <MainBody>
      <LineImg src={lineSvg}/>
      <Gap/>
      {steps.map((step, i) => <Step key={i} {...step}/>)}
    </MainBody>
  </FullPageContainer>)
}
