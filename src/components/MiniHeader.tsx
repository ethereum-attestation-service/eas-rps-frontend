import { useNavigate } from "react-router";
import styled from "styled-components";
import { SmallMaxWidthDiv } from "./MaxWidthDiv";

const Container = styled(SmallMaxWidthDiv)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(57, 53, 84, 0.05);
  padding: 15px 30px;
  box-sizing: border-box;
  margin: 0 20px 20px 20px;
  border-radius: 25px;
  backdrop-filter: blur(25px);
`;

type SelectedProps = { selected: boolean };

const HeaderItem = styled.div<SelectedProps>`
  color: ${({ selected }) => (selected ? "#fff" : "#272343")};
  background-color: ${({ selected }) => (selected ? "#FF8E3C" : "transparent")};
  border-radius: 25px;
  cursor: pointer;
  padding: 12px 15px;
  white-space: nowrap;
  text-align: center;
  text-shadow: ${({ selected }) =>
    selected ? "4px 4px 10px rgba(39, 35, 67, 0.51)" : "none"};
  font-family: "Space Grotesk";
  font-size: ${({ selected }) => (selected ? "1rem" : "0.8rem")};
  font-style: normal;
  font-weight: ${({ selected }) => (selected ? 700 : 400)};
  line-height: normal;
`;

export default function MiniHeader({
  selected,
  links,
}: {
  selected: number;
  links: { name: string; url: string }[];
}) {
  const navigate = useNavigate();

  return (
    <Container>
      {links.map((link, index) => (
        <HeaderItem
          selected={selected === index}
          onClick={() => navigate(link.url)}
        >
          {link.name}
        </HeaderItem>
      ))}
    </Container>
  );
}
