import React, { useState } from "react";
import { useTournamentStore } from "../../store/tournamentStore";
import { useNavigate } from "react-router-dom";
import styles from "./TournamentPage.module.scss";
import type { PlayerWithLives } from "../../store/tournamentStore";

const TournamentPage: React.FC = () => {
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const setChillZoneTemp = useTournamentStore(
    (state) => state.setChillZoneTemp,
  );
  const generateLobbies = useTournamentStore((state) => state.generateLobbies);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const filteredPlayers: PlayerWithLives[] = players.filter(
    (p) => p.nickname || p.mmr || p.role,
  );

  const sortedPlayers: PlayerWithLives[] = [...filteredPlayers].sort(
    (a, b) => b.currentLives - a.currentLives,
  );

  const handleGenerateLobbies = () => {
    const { remaining } = generateLobbies();
    setChillZoneTemp(remaining);
    navigate("/lobbies");
  };

  const handleChange = (
    id: string,
    field: keyof PlayerWithLives,
    value: string | number,
  ) => {
    setPlayers(
      players.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]:
                typeof value === "string" && !isNaN(Number(value))
                  ? Number(value)
                  : value,
            }
          : p,
      ),
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Турнирная таблица</h1>

      <button
        className={styles.generateBtn}
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? "Сохранить" : "Изменить"}
      </button>

      <table className={styles.playerTable}>
        <thead>
          <tr>
            <th>№</th>
            <th>Никнейм</th>
            <th>MMR</th>
            <th>Роль</th>
            <th>Кол-во жизней</th>
            <th>Chill Zone</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.id}>
              <td>{index + 1}</td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={player.nickname}
                    onChange={(e) =>
                      handleChange(player.id, "nickname", e.target.value)
                    }
                  />
                ) : (
                  player.nickname
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={player.mmr}
                    onChange={(e) =>
                      handleChange(player.id, "mmr", e.target.value)
                    }
                  />
                ) : (
                  player.mmr
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    value={player.role}
                    onChange={(e) =>
                      handleChange(player.id, "role", e.target.value)
                    }
                  />
                ) : (
                  player.role
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="number"
                    min={0}
                    value={player.currentLives}
                    onChange={(e) =>
                      handleChange(player.id, "currentLives", e.target.value)
                    }
                  />
                ) : (
                  player.currentLives
                )}
              </td>
              <td>
                {isEditing ? (
                  <input
                    type="number"
                    min={0}
                    value={player.chillZone}
                    onChange={(e) =>
                      handleChange(player.id, "chillZone", e.target.value)
                    }
                  />
                ) : (
                  player.chillZone
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.buttonWrapper}>
        <button className={styles.generateBtn} onClick={handleGenerateLobbies}>
          Сгенерировать лобби
        </button>
      </div>
    </div>
  );
};

export default TournamentPage;
