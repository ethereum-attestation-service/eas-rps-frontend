import React from "react";
import styled from "styled-components";
import { HiOutlineSparkles } from "react-icons/hi";
import { BiTime, BiVector, BiUser } from "react-icons/bi";
import { FaFistRaised } from "react-icons/fa";
import { useNavigate } from "react-router";
// Define the styled component outside of the component
const FooterContainer = styled.footer`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #333; /* Change as needed */
  color: white; /* Change as needed */
  text-align: center;
  padding: 1rem 0;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: visible;
`;

const FooterItem = styled.div`
  min-width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  overflow: visible;
`;

const ItemText = styled.div`
  color: #fff;
  text-align: center;
  font-family: Nunito;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px; /* 340% */
`;

const FixedFooter: React.FC = () => {
  const navigate = useNavigate();
  return (
    <FooterContainer>
      <FooterItem
        onClick={() => {
          navigate("/challenges");
        }}
      >
        <HiOutlineSparkles />
        <ItemText>Incoming</ItemText>
      </FooterItem>
      <FooterItem
        onClick={() => {
          navigate("/games");
        }}
      >
        <BiTime />
        <ItemText>History</ItemText>
      </FooterItem>
      <FooterItem
        style={{
          height: 24,
          borderRadius: 30,
          backgroundColor: "#333",
          marginBottom: 50,
          padding: 20,
        }}
        onClick={() => {
          navigate("/");
        }}
      >
        <FaFistRaised style={{ overflow: "visible" }} />
        <ItemText>Start a Battle</ItemText>
      </FooterItem>
      <FooterItem>
        <BiVector />
        <ItemText>Graph</ItemText>
      </FooterItem>
      <FooterItem>
        <BiUser />
        <ItemText>Profile</ItemText>
      </FooterItem>
    </FooterContainer>
  );
};

export default FixedFooter;
