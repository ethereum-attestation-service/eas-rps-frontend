import styled from "styled-components";
import { choiceToText } from "../utils/utils";

type Props = {choice: number};

const EmojiIcon = styled.div`
  font-size: 5rem;
  margin: 1rem 0;
`;

export default function InGameChosenIcon({choice}: Props) {
  return (
    <EmojiIcon>
      {choiceToText(choice)}
    </EmojiIcon>
  )
}
