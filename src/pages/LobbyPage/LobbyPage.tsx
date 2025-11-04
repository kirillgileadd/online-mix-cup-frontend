import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournamentStore } from "../../store/tournamentStore";
import type { PlayerWithLives } from "../../store/tournamentStore";
import styles from "./LobbyPage.module.scss";

interface TeamSelections {
  [lobbyKey: string]: {
    team1: string[];
    team2: string[];
    winner?: "team1" | "team2";
  };
}

const LobbyPage: React.FC = () => {
  const generateLobbies = useTournamentStore((state) => state.generateLobbies);
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const chillZoneTemp = useTournamentStore((state) => state.chillZoneTemp);
  const setChillZoneTemp = useTournamentStore(
    (state) => state.setChillZoneTemp,
  );

  const [lobbies, setLobbies] = useState<PlayerWithLives[][]>([]);
  const [teamSelections, setTeamSelections] = useState<TeamSelections>({});
  const navigate = useNavigate();

  useEffect(() => {
    const playersWithIds: PlayerWithLives[] = players.map((p) => ({
      ...p,
      id: p.id || crypto.randomUUID(),
      currentLives: p.currentLives ?? 2,
    }));

    setPlayers(playersWithIds);

    const { lobbies, remaining } = generateLobbies();
    setChillZoneTemp(remaining);
    setLobbies(lobbies);

    const initialSelections: TeamSelections = {};

    lobbies.forEach((lobby, idx) => {
      const lobbyKey = `lobby-${idx}`;
      const sortedByMMR = [...lobby].sort(
        (a, b) => Number(b.mmr) - Number(a.mmr),
      );

      const topMMR = sortedByMMR[0].mmr;
      const topCandidates = sortedByMMR.filter((p) => p.mmr === topMMR);
      const captain1 =
        topCandidates[Math.floor(Math.random() * topCandidates.length)];

      let captain2: PlayerWithLives;
      if (sortedByMMR.length > 1) {
        const remainingCandidates = sortedByMMR.filter(
          (p) => p.id !== captain1.id,
        );
        const secondTopMMR = remainingCandidates[0].mmr;
        const secondCandidates = remainingCandidates.filter(
          (p) => p.mmr === secondTopMMR,
        );
        captain2 =
          secondCandidates[Math.floor(Math.random() * secondCandidates.length)];
      } else {
        captain2 = captain1;
      }

      initialSelections[lobbyKey] = {
        team1: [captain1.id, "", "", "", ""],
        team2: [captain2.id, "", "", "", ""],
        winner: undefined,
      };
    });

    setTeamSelections(initialSelections);
  }, []);

  const handleNextRound = () => {
    const chillIds = new Set(chillZoneTemp.map((p) => p.id));

    const updatedPlayers = players.map((player) => {
      let lostLife = false;

      Object.values(teamSelections).forEach(({ team1, team2, winner }) => {
        if (!winner) return;

        const loserTeam = winner === "team1" ? team2 : team1;
        const loserIds = loserTeam
          .filter(Boolean)
          .filter((id) => !chillIds.has(id));

        if (loserIds.includes(player.id)) lostLife = true;
      });

      return lostLife
        ? { ...player, currentLives: Math.max(0, player.currentLives - 1) }
        : player;
    });

    // Увеличиваем chillZone для игроков в Chill Zone
    const finalPlayers = updatedPlayers.map((p) =>
      chillIds.has(p.id) ? { ...p, chillZone: p.chillZone + 1 } : p,
    );

    setPlayers(finalPlayers);
    setChillZoneTemp([]);
    navigate("/tournament");
  };

  const handleWinnerChange = (lobbyKey: string, winner: "team1" | "team2") => {
    setTeamSelections((prev) => ({
      ...prev,
      [lobbyKey]: { ...prev[lobbyKey], winner },
    }));
  };

  const renderTeamsTable = (lobby: PlayerWithLives[], lobbyKey: string) => {
    const rowsCount = 5;
    const options = lobby.map((p) => ({ id: p.id, nickname: p.nickname }));

    const handleSelectChange = (
      team: "team1" | "team2",
      rowIndex: number,
      playerId: string,
    ) => {
      setTeamSelections((prev) => {
        const updated = { ...prev };
        updated[lobbyKey][team][rowIndex] = playerId;
        return updated;
      });
    };

    const selectedIds = new Set([
      ...(teamSelections[lobbyKey]?.team1 || []),
      ...(teamSelections[lobbyKey]?.team2 || []),
    ]);

    return (
      <>
        <table className={styles.teamsTable}>
          <thead>
            <tr>
              <th>Команда 1</th>
              <th>Команда 2</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowsCount }).map((_, i) => (
              <tr key={`${lobbyKey}-team-${i}`}>
                <td>
                  <select
                    value={teamSelections[lobbyKey]?.team1[i] || ""}
                    onChange={(e) =>
                      handleSelectChange("team1", i, e.target.value)
                    }
                    disabled={i === 0}
                  >
                    <option value="">Выберите игрока</option>
                    {options
                      .filter(
                        (p) =>
                          !selectedIds.has(p.id) ||
                          p.id === teamSelections[lobbyKey]?.team1[i],
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nickname}
                        </option>
                      ))}
                  </select>
                </td>
                <td>
                  <select
                    value={teamSelections[lobbyKey]?.team2[i] || ""}
                    onChange={(e) =>
                      handleSelectChange("team2", i, e.target.value)
                    }
                    disabled={i === 0}
                  >
                    <option value="">Выберите игрока</option>
                    {options
                      .filter(
                        (p) =>
                          !selectedIds.has(p.id) ||
                          p.id === teamSelections[lobbyKey]?.team2[i],
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nickname}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.winnerSection}>
          <label>
            Победила:{" "}
            <select
              value={teamSelections[lobbyKey]?.winner || ""}
              onChange={(e) =>
                handleWinnerChange(
                  lobbyKey,
                  e.target.value as "team1" | "team2",
                )
              }
            >
              <option value="">Выберите команду</option>
              <option value="team1">Команда 1</option>
              <option value="team2">Команда 2</option>
            </select>
          </label>
        </div>
      </>
    );
  };

  const renderPlayerTable = (data: PlayerWithLives[], prefix: string) => (
    <table>
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
        {data.map((player, i) => {
          const safeId = player.id || `${prefix}-${i}`;
          return (
            <tr key={`${prefix}-${safeId}`}>
              <td>{i + 1}</td>
              <td>{player.nickname}</td>
              <td>{player.mmr}</td>
              <td>{player.role}</td>
              <td>{player.currentLives}</td>
              <td>{player.chillZone}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Лобби турнира</h1>

      {lobbies.map((lobby, idx) => {
        const lobbyKey = `lobby-${idx}`;
        return (
          <div key={lobbyKey} className={styles.lobbyTableWrapper}>
            <div className={styles.flexRow}>
              <div className={styles.lobbySection}>
                <h2>Лобби {idx + 1}</h2>
                {renderPlayerTable(lobby, lobbyKey)}
              </div>
              <div className={styles.teamsSection}>
                <h2>Формирование команд</h2>
                {renderTeamsTable(lobby, lobbyKey)}
              </div>
            </div>
          </div>
        );
      })}

      {chillZoneTemp.length > 0 && (
        <div className={styles.chillZoneSection}>
          <h2>Chill Zone</h2>
          {renderPlayerTable(chillZoneTemp, "chill")}
        </div>
      )}

      <div className={styles.buttonWrapper}>
        <button onClick={handleNextRound} className={styles.nextBtn}>
          Завершить раунд
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
