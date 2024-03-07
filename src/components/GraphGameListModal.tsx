// CustomModal.tsx
import React from "react";
import styled from "styled-components";
import Modal from "react-modal";

// Set app element for accessibility (set this to your root app element)
Modal.setAppElement("#root");

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 1000;
`;

const GameItem = styled.div`
  cursor: pointer;
  background-color: #2a9d8f;
  color: #f0f2f5;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-wrap: anywhere;

  &:hover {
    background-color: #21867a;
  }
`;

const Container = styled.div`
  overflow-wrap: anywhere;
`;

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentLink: any;
  currentGames: any[];
  frontendURL: string;
}

function GraphGameListModal({
  isOpen,
  onRequestClose,
  currentLink,
  currentGames,
  frontendURL,
}: CustomModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayElement={(props, contentEl) => (
        <Overlay {...props}>{contentEl}</Overlay>
      )}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      preventScroll={true}
    >
      {isOpen && (
        <Container>
          <h2>
            Games played between {currentLink.source.id} and{" "}
            {currentLink.target.id}
          </h2>
          {currentGames.map((game, index) => (
            <GameItem
              key={index}
              onClick={() => {
                window.location.href = `${frontendURL}/summary/${game.uid}`;
              }}
            >
              Game UID {game.uid}
            </GameItem>
          ))}
        </Container>
      )}
    </Modal>
  );
}

export default GraphGameListModal;
