import styled from "styled-components";
import { theme } from "../utils/theme";

export const ButtonBase = `
  padding: 12px 18px;
  box-sizing: border-box;
  border-radius: 5px;
  border: 0;
  user-select: none;
  text-align: center;
  font-family: 'Nunito';
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

type ButtonProps = {
  disabled?: boolean;
};

export const ButtonStandard = styled.button<ButtonProps>`
  ${ButtonBase};
  background-color: ${({ disabled }) =>
    disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-500"]};
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? "inherit" : "pointer")};

  :hover {
    background-color: ${({ disabled }) =>
      disabled ? theme.neutrals["cool-grey-200"] : theme.primary["indigo-700"]};
  }
`;

