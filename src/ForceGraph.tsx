"use client";

import { useCallback, useEffect, useState } from "react";
import SpriteText from "three-spritetext";
import * as THREE from "three";
import ForceGraph3D  from "react-force-graph-3d";
import axios from "axios";
import { useAccount } from "wagmi";
import GraphGameListModal from "./components/GraphGameListModal";
import { baseURL, clientURL } from "./utils/utils";
export default function ForceGraph() {
  const [graph, setGraph] = useState({ nodes: [], links: [] });

  const [currentLink, setCurrentLink] = useState<any>(null);
  const [currentGames, setCurrentGames] = useState<any[]>([]);
  const { address } = useAccount();

  async function getGames(player1: string, player2: string) {
    const res = await axios.post(`${baseURL}/getGamesBetweenPlayers`, {
      player1,
      player2,
    });
    setCurrentGames(res.data);
  }

  async function update() {
    const graph = await axios.post<{ nodes: any[]; links: any[] }>(
      `${baseURL}/localGraph`,
      { address }
    );
    const nodes = graph.data.nodes.map((n) => ({
      ...n,
      name: n.id,
      type: "address",
      value: 10,
    }));

    setGraph({ nodes: nodes as any, links: graph.data.links as any });
  }

  useEffect(() => {
    if (address) {
      update();
    }
  }, [address]);

  useEffect(() => {
    if (currentLink) {
      getGames(currentLink.source.id, currentLink.target.id);
    }
  }, [currentLink]);

  // Load blockies.
  let blockies: any;
  if (typeof document !== "undefined") {
    blockies = require("ethereum-blockies");
  }

  // Generate one blockie to hack around a bug in the library.
  blockies?.create({ seed: "fixies!" });

  // Open stuff on click.
  const handleLinkClick = useCallback((link: any) => {
    setCurrentLink(link);
  }, []);

  // Open stuff on click.
  const handleNodeClick = useCallback((node: any) => {
    if (node.type === "address") {
      window.open(`https://etherscan.io/address/${node.id}`);
    }
  }, []);

  return (
    <main>
      <GraphGameListModal
        frontendURL={clientURL}
        currentLink={currentLink}
        currentGames={currentGames}
        isOpen={!!currentLink}
        onRequestClose={() => {
          setCurrentLink(null);
        }}
      />
      <ForceGraph3D
        graphData={graph}
        nodeAutoColorBy="type"
        linkColor={(link: any) => {
          return link.source === currentLink?.source &&
            link.target === currentLink?.target
            ? "red"
            : "grey";
        }}
        linkWidth={1}
        linkOpacity={1}
        onLinkClick={handleLinkClick}
        onNodeClick={handleNodeClick}
        nodeThreeObject={(node: any) => {
          if (node.type === "address") {
            const icon = blockies?.create({ seed: node.id });
            const data = icon?.toDataURL("image/png");
            const texture = new THREE.TextureLoader().load(data);
            texture.colorSpace = THREE.SRGBColorSpace;
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(8, 8, 0);
            return sprite;
          } else {
            const sprite = new SpriteText(node.name);
            sprite.color = node.color;
            sprite.textHeight = 4;
            return sprite;
          }
        }}
      />
    </main>
  );
}
