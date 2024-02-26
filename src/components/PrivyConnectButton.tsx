import {usePrivy} from "@privy-io/react-auth";
import styled from "styled-components";
import {ButtonBase} from "../styles/buttons";
import {theme} from "../utils/theme";
import {formatAttestationLongValueV2} from "../utils/utils";

const StyledButton = styled.button`
    ${ButtonBase};

    min-width: 150px;
    background-color: ${theme.neutrals["cool-grey-050"]};
    border: 1px solid ${theme.neutrals["cool-grey-100"]}
    padding: 10px 25px;

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

type Props = { handleClickWhileConnected: () => void };

export default function PrivyConnectButton({
                                             handleClickWhileConnected,
                                           }: Props) {
  const {login, user, ready} = usePrivy();
  const address = user?.wallet?.address;


  return (
    <StyledButton onClick={
      !ready ? undefined
        : address ? handleClickWhileConnected
          : login}>
      {!ready
        ? "Loading..." :
        address
          ? formatAttestationLongValueV2(address)
          : "Connect Wallet"}
    </StyledButton>
  );
}
