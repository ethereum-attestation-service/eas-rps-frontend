type Props = {
  address: string;
  score: number | string;
  overrideENSWith: string;
  style?: React.CSSProperties;
  badges: string[];
  ens?: string;
  ensAvatar?: string;
  className?: string;
  ignoreClick?: boolean;
};

export default function PlayerCard({
                                     address,
                                     score,
                                     overrideENSWith,
                                     badges,
                                     style,
                                     className,
                                     ens,
                                     ensAvatar,
                                     ignoreClick
                                   }: Props) {
  return (
    <>

    </>
  )
}
