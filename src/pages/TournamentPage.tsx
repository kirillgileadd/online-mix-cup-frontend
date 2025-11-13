import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Center } from "@mantine/core";
import { TournamentTable } from "../features/TournamentTable";
import { useLobbyStore } from "../features/Lobby";
import { usePlayerStore } from "../entitity/Player";

export const TournamentPage: React.FC = () => {
  const navigate = useNavigate();
  const generateLobbies = useLobbyStore((state) => state.generateLobbies);
  const generateTeams = useLobbyStore((state) => state.generateTeams);
  const players = usePlayerStore((state) => state.players);

  const handleGenerateLobbies = () => {
    generateLobbies(players);
    generateTeams();
    navigate("/lobbies");
  };

  return (
    <div className="p-6 mx-auto">
      <TournamentTable />
      <Center className="mt-6">
        <Button color="blue" size="md" onClick={handleGenerateLobbies}>
          Сгенерировать лобби
        </Button>
      </Center>
    </div>
  );
};
