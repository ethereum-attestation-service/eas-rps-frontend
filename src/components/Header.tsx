import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import { theme } from "../utils/theme";
// import { CustomConnectButton } from "./ui/CustomConnectKit";
import PrivyConnectButton from "./PrivyConnectButton";
import { activeChainConfig, clientURL } from "../utils/utils";
import invariant from "tiny-invariant";
import { useAccount } from "wagmi";
import { FaQrcode, FaBars } from "react-icons/fa";
import { useAutoReveal } from "../hooks/useAutoReveal";
import { useEffect, useState } from "react";
import { ProfileModal } from "./ProfileModal";
import { usePrivy } from "@privy-io/react-auth";

const Outer = styled.div`
  font-family: "Nunito", sans-serif;
  user-select: none;

  padding: 1rem 3rem;
  color: #000;

  @media only screen and (max-width: 750px) {
    padding: 1rem 1rem;
  }
`;

const Container = styled.div`
  display: flex;
`;

const LogoContainer = styled.div`
  min-width: 100px;
  display: flex;
  align-items: center;
`;

const MainNavigation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 100%;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const QR = styled(FaQrcode)`
  margin-right: 10px;
`;

const LogoImage = styled.img`
  width: 40px;
  margin-right: 4px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;

  @media only screen and (min-width: 700px) {
    .second-search-bar {
      display: none;
    }
  }
`;

const HamburgerContainer = styled.div`
  cursor: pointer;
  margin-left: 12px;
  @media only screen and (min-width: 700px) {
    display: none;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media only screen and (max-width: 700px) {
    display: none;
  }
`;

const MobileLinks = styled.div`
  display: block;
  margin-top: 20px;

  @media only screen and (min-width: 900px) {
    display: none;
  }
`;

const LogoText = styled.span`
  font-family: Audiowide, sans-serif;
  font-size: 22px;
  font-weight: 400;
  white-space: nowrap;
`;

type MenuItemProps = {
  active: boolean;
};

const MenuItem = styled.div<MenuItemProps>`
  border-radius: 20px;
  padding: 12px 20px;
  font-family: "Montserrat", serif;
  font-style: normal;
  font-weight: ${({ active }) => (active ? "700" : "500")};
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  color: #333342;
  text-align: center;

  :hover {
    background-color: ${({ active }) => (active ? "#F1F4F9" : "#f1f4f966")};
  }
`;

type MenuItemType = {
  title: string;
  path: string;
  onClick: () => void;
};

export function Header() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { user } = usePrivy();
  useAutoReveal(address);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let menuItems: MenuItemType[] = [];

  if (user && address) {
    menuItems.push({
      title: "Home",
      onClick: () => navigate("/"),
      path: "/",
    });
    menuItems.push({
      title: "Challenges",
      onClick: () => navigate("/challenges"),
      path: "/challenges",
    });
    menuItems.push({
      title: "Games",
      onClick: () => navigate("/games"),
      path: "/games",
    });
  }

  invariant(activeChainConfig, "activeChainConfig is not set");

  return (
    <>
      <Outer>
        <Container>
          <MainNavigation>
            <LogoContainer>
              <Logo onClick={() => navigate("/")}>
                <LogoImage src="/logo.png" />
                <LogoText>RPS</LogoText>
              </Logo>
            </LogoContainer>
            <Left>
              <Links>
                {menuItems.map((menuItem, i) => (
                  <MenuItem
                    key={i}
                    onClick={menuItem.onClick}
                    active={menuItem.path === location.pathname}
                  >
                    {menuItem.title}
                  </MenuItem>
                ))}
              </Links>
            </Left>
            <Right>
              {window.location.href !== `${clientURL}/` || address ? (
                <PrivyConnectButton
                  handleClickWhileConnected={() => {
                    setIsModalOpen(true);
                  }}
                />
              ) : null}
              <HamburgerContainer>
                <FaBars
                  size={24}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </HamburgerContainer>
            </Right>
          </MainNavigation>
        </Container>
        <MobileLinks>
          {isMobileMenuOpen &&
            menuItems.map((menuItem, i) => (
              <MenuItem
                key={i}
                onClick={menuItem.onClick}
                active={menuItem.path === location.pathname}
              >
                {menuItem.title}
              </MenuItem>
            ))}
        </MobileLinks>
      </Outer>
      {isModalOpen ? (
        <ProfileModal
          handleClose={() => {
            setIsModalOpen(false);
          }}
        />
      ) : null}
    </>
  );
}
