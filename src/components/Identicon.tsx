import * as jdenticon from "jdenticon";
import styled from "styled-components";

type ContainerProps = {
  size: number;
};

const Container = styled.div<ContainerProps>`
  background-color: #fff;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

type Props = {
  address: string;
  size: number;
  className?: string;
};

export function Identicon({ address, size, className }: Props) {
  const icon = jdenticon.toSvg(address, size);

  if (!address || !icon) return null;

  return (
    <Container size={size} className={className}>
      <img
        alt={"Identicon"}
        style={{ borderRadius: 8 }}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`}
      />
    </Container>
  );
}
