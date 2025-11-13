import React from "react";
// import { useTournamentStore } from "../store/tournamentStore";
import { useNavigate } from "react-router-dom";
import { Button, Center } from "@mantine/core";
import { TournamentTable } from "../features/TournamentTable";
import { usePlayerStore } from "../entitity/Player";
import { useLobbyStore } from "../features/Lobby";

const TournamentPage: React.FC = () => {
  const players = usePlayerStore((state) => state.players);
  const generateLobbies = useLobbyStore((state) => state.generateLobbies);
  const navigate = useNavigate();

  const handleGenerateLobbies = () => {
    const alivePlayers = players.filter((p) => (p.lives ?? 2) > 0);
    generateLobbies(alivePlayers);
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

export default TournamentPage;
