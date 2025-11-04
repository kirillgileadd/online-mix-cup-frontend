import React, { useEffect } from "react";
import styles from "./PlayerTable.module.scss";
import { useDebounce } from "../../hooks/useDebounce";
import { useTournamentStore } from "../../store/tournamentStore";

const PlayerTable: React.FC = () => {
  const players = useTournamentStore((s) => s.players) || [];
  const setPlayers = useTournamentStore((s) => s.setPlayers);
  const lives = useTournamentStore((s) => s.lives) || 2;

  // Инициализация первой строки
  useEffect(() => {
    if (!players.length) {
      setPlayers([
        {
          id: crypto.randomUUID(),
          nickname: "",
          mmr: "",
          role: "",
          ready: false,
          chillZone: 0,
          currentLives: lives, // сразу lives
        },
      ]);
    }
  }, [setPlayers, players.length, lives]);

  // Дебаунс последнего ника
  const lastNickname = players[players.length - 1]?.nickname || "";
  const debouncedLastNickname = useDebounce(lastNickname, 500);

  // Добавление новой строки после ввода ника
  useEffect(() => {
    const last = players[players.length - 1];
    if (last && last.nickname.trim() !== "") {
      setPlayers([
        ...players,
        {
          id: crypto.randomUUID(),
          nickname: "",
          mmr: "",
          role: "",
          ready: false,
          chillZone: 0,
          currentLives: lives,
        },
      ]);
    }
  }, [debouncedLastNickname, setPlayers, players, lives]);

  // Вычитаем жизнь у игроков с крестиком при создании таблицы
  useEffect(() => {
    if (!players.length) return;

    setPlayers(
      players.map((p) => {
        const isEmpty = !p.nickname && !p.mmr && !p.role;
        if (isEmpty) return p; // пустые строки не трогаем

        return {
          ...p,
          currentLives: p.ready ? lives : Math.max(0, lives - 1),
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lives]);

  const handleTextChange = (
    id: string,
    field: "nickname" | "mmr" | "role",
    value: string,
  ) => {
    setPlayers(
      players.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const handleReadyToggle = (id: string) => {
    setPlayers(
      players.map((p) => {
        if (p.id === id) {
          const newReady = !p.ready;
          return {
            ...p,
            ready: newReady,
            currentLives: newReady
              ? p.currentLives // если ставим галочку — жизнь не трогаем
              : Math.max(0, p.currentLives - 1), // крестик — минус 1
          };
        }
        return p;
      }),
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Никнейм</th>
            <th>MMR</th>
            <th>Роль</th>
            <th>Готов</th>
          </tr>
        </thead>
        <tbody>
          {players.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={row.nickname}
                  onChange={(e) =>
                    handleTextChange(row.id, "nickname", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.mmr}
                  onChange={(e) =>
                    handleTextChange(row.id, "mmr", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.role}
                  onChange={(e) =>
                    handleTextChange(row.id, "role", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  className={row.ready ? styles.active : ""}
                  onClick={() => handleReadyToggle(row.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: row.ready ? "#4caf50" : "#f44336",
                    fontSize: "16px",
                  }}
                >
                  {row.ready ? "✔️" : "❌"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerTable;
