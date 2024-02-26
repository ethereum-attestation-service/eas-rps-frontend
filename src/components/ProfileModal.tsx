import {Modal} from "./ui/Modal";
import styled from "styled-components";
import {FaCheck, FaTimes} from "react-icons/fa";
import {FiCopy} from "react-icons/fi";
import {theme} from "../utils/theme";
import {Identicon} from "./Identicon";
import {useState} from "react";
import {useNavigate} from "react-router";
import {formatAttestationLongValueV2} from "../utils/utils";
import {usePrivy} from "@privy-io/react-auth";
import {useStore} from "../useStore";

const Container = styled(Modal)`
    max-width: 400px;
    color: ${theme.neutrals["cool-grey-900"]};
    z-index: 3;
    font-family: "Nunito", sans-serif;
    font-size: 18px;
    font-weight: 500;
`;

const Header = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-content: space-between;
    text-align: center;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
`;

const Right = styled.div`
    text-align: right;
`;

const AddressIconHolder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
`;

const AddressText = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    margin-top: 8px;
`;

const CopyIcon = styled(FiCopy)`
    margin-left: 8px;
    cursor: pointer;
`;

const Check = styled(FaCheck)`
    margin-left: 8px;
    cursor: pointer;
`;

type Props = {
  handleClose: () => void;
};

const DisconnectButton = styled.button`
    background-color: ${theme.neutrals["cool-grey-050"]};
    border: 1px solid ${theme.neutrals["cool-grey-100"]};
    padding: 10px 25px;
    margin-top: 20px;
    width: 100%;
    font-family: "Space Grotesk", sans-serif;
    font-weight: 700;
    font-size: 18px;
    cursor: pointer;
    transition: 200ms ease;

    &:hover {
        transform: translateY(-6px);
        box-shadow: 0 6px 10px -4px ${theme.primary["indigo-100"]};
    }

    &:active {
        transform: translateY(-3px);
        box-shadow: 0 6px 10px -4px ${theme.primary["indigo-100"]};
    }
`;

export function ProfileModal({handleClose}: Props) {
  const [copying, setCopying] = useState(false);
  const navigate = useNavigate();
  const {user, logout} = usePrivy();
  const address = user?.wallet?.address;

  const setKeyStorage = useStore((state) => state.setKeyObj);
  const setSigRequested = useStore((state) => state.setSigRequested);

  if (!address) return null;

  return (
    <Container handleClose={handleClose} isVisible={true}>
      <Header>
        <div/>
        <div>Account</div>
        <Right>
          <FaTimes
            onClick={handleClose}
            size={20}
            color={theme.neutrals["cool-grey-700"]}
          />
        </Right>
      </Header>

      <AddressIconHolder>
        <Identicon address={address} size={80}/>
      </AddressIconHolder>

      <AddressText>
        {formatAttestationLongValueV2(address)}{" "}
        {copying ? (
          <Check color={theme.supporting["green-vivid-500"]}/>
        ) : (
          <CopyIcon
            color={theme.neutrals["cool-grey-400"]}
            onClick={() => {
              setCopying(true);
              navigator.clipboard.writeText(address).then();
              setTimeout(() => setCopying(false), 1000);
            }}
          />
        )}
      </AddressText>
      <DisconnectButton
        onClick={async () => {
          setKeyStorage({key: '', wallet: ''});
          await logout();
          handleClose();
          navigate("/");
          window.location.reload();
        }}
      >
        Disconnect
      </DisconnectButton>
    </Container>
  );
}
