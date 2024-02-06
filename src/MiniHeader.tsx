import { useNavigate } from "react-router";
import styled from "styled-components";

const Container = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5%;
  margin: 20px;
  justify-content: center;
`;

type SelectedProps = { selected: boolean };

const HeaderItem = styled.div<SelectedProps>`
  color: #1e1e1e;
  text-align: center;
  font-family: Nunito;
  font-size: 10px;
  font-style: normal;
  font-weight: 800;
  background-color: ${({ selected }) => (selected ? "#FFBF69" : "transparent")};
  border-radius: 10px;
  cursor: pointer;
  padding: 8px 12px;
  white-space: nowrap;
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
          {link.name.toUpperCase()}
        </HeaderItem>
      ))}
    </Container>
  );
}
