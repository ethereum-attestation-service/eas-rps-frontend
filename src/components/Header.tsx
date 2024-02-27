import styled from "styled-components";
import {useLocation, useNavigate} from "react-router";
import {theme} from "../utils/theme";
import PrivyConnectButton from "./PrivyConnectButton";
import {activeChainConfig, clientURL, getLocalKey} from "../utils/utils";
import invariant from "tiny-invariant";
import {useAccount} from "wagmi";
import {FaQrcode, FaBars} from "react-icons/fa";
import {useAutoReveal} from "../hooks/useAutoReveal";
import {useEffect, useState} from "react";
import {ProfileModal} from "./ProfileModal";
import {usePrivy} from "@privy-io/react-auth";
import {useStore} from "../useStore";
import {useSigner} from "../utils/wagmi-utils";

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
    cursor: pointer;
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
    max-height: 60px;
    max-width: 100px;
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
    font-weight: ${({active}) => (active ? "700" : "500")};
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
    color: #333342;
    text-align: center;

    :hover {
        background-color: ${({active}) => (active ? "#F1F4F9" : "#f1f4f966")};
    }
`;

type MenuItemType = {
  title: string;
  path: string;
  onClick: () => void;
};

export function Header() {
  const navigate = useNavigate();
  const {user} = usePrivy();
  const cachedAddress = useStore((state) => state.cachedAddress);
  const setCachedAddress = useStore((state) => state.setCachedAddress);
  const keyStorage = useStore((state) => state.keyObj);
  const setKeyStorage = useStore((state) => state.setKeyObj);
  const sigRequested = useStore((state) => state.sigRequested);
  const setSigRequested = useStore((state) => state.setSigRequested);
  const address = user?.wallet?.address;
  useAutoReveal(address);
  const signer = useSigner();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let menuItems: MenuItemType[] = [];

  if (address) {
    menuItems.push({
      title: "Play",
      onClick: () => navigate("/"),
      path: "/",
    });
    menuItems.push({
      title: "Profile",
      onClick: () => navigate("/qr"),
      path: "/qr",
    });
    menuItems.push({
      title: "Leaderboard",
      onClick: () => navigate("/leaderboard/global"),
      path: "/leaderboard/global",
    });
  }

  invariant(activeChainConfig, "activeChainConfig is not set");

  useEffect(() => {
    if (address && address !== cachedAddress) {
      setCachedAddress(address);
    }
  }, [address]);

  useEffect(() => {
    if (address && signer && !sigRequested) {
      setSigRequested(true);
      try {
        getLocalKey(signer, keyStorage, setKeyStorage,setSigRequested);
      } catch (e) {
        console.log('caught error', e);
        setSigRequested(false);
      }
    }
  }, [address, signer, sigRequested]);

  useEffect(() => {
    if (!address && !signer) {
      setSigRequested(false);
    }
  }, [address, signer]);

  return (
    <>
      <Outer>
        <Container>
          <MainNavigation>
            <LogoContainer onClick={()=>{navigate('/')}}>
              <LogoImage src="/images/rps/rps-logo.png"/>
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
                <>
                  <PrivyConnectButton
                    handleClickWhileConnected={() => {
                      setIsModalOpen(true);
                    }}
                  />
                  <HamburgerContainer>
                    <FaBars
                      size={24}
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    />
                  </HamburgerContainer>
                </>
              ) : null}
            </Right>
          </MainNavigation>
        </Container>
        <MobileLinks>
          {isMobileMenuOpen &&
            menuItems.map((menuItem, i) => (
              <MenuItem
                key={i}
                onClick={() => {
                  menuItem.onClick();
                  setIsMobileMenuOpen(false);
                }}
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
