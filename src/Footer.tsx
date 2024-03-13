import React from "react";
import styled from "styled-components";
import {HiOutlineSparkles} from "react-icons/hi";
import {FaGithub, FaRegQuestionCircle} from "react-icons/fa";
import {useNavigate} from "react-router";

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: #393554;
    width: 100%;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1.2rem;
    box-sizing: border-box;
`;

const Title = styled.div`
    color: #FFF;
    font-family: "Space Grotesk";
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    text-align: left;
    padding: 0.3rem;
`;

const Description = styled.div`
    color: rgba(255, 255, 255, 0.75);
    font-family: Nunito;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 0.3rem;
`;

const Link = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;


const LinkDescriptor = styled.div`
    color: rgba(255, 255, 255, 0.75);
    font-family: "Space Grotesk";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 1rem;
    cursor: pointer;
`;

const ICON_SIZE = 22;
function Footer() {
  const navigate = useNavigate();
  return (
    <Container>
      <Column>
        <Title>RPS.sh</Title>
        <Description>
          Example open-source app using attestations to play rock paper scissors.
        </Description>
      </Column>
      <Column>
        <Link onClick={()=>{navigate('/')}}>
          <HiOutlineSparkles size={ICON_SIZE} color={'#fff'}/>
          <LinkDescriptor>
            New Challenge
          </LinkDescriptor>
        </Link>
        <Link onClick={()=>{navigate('/how-it-works')}}>
          <FaRegQuestionCircle size={ICON_SIZE} color={'#fff'}/>
          <LinkDescriptor>
            How it Works
          </LinkDescriptor>
        </Link>
        <Link onClick={()=>{window.location.href = ('https://github.com/ethereum-attestation-service/eas-rps-frontend')}}>
          <FaGithub size={ICON_SIZE} color={'#fff'}/>
          <LinkDescriptor>
            Github Repo
          </LinkDescriptor>
        </Link>
      </Column>
    </Container>
  );
}

export default Footer;
