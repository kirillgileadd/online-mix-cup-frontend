import React, { useState } from "react";
import PlayerTable from "../../components/PlayerTable/PlayerTable";
import styles from "./CreateTournament.module.scss";
import { useTournamentStore } from "../../store/tournamentStore";
import { useNavigate } from "react-router-dom";

const CreateTournament: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lives = useTournamentStore((state) => state.lives);
  const setLives = useTournamentStore((state) => state.setLives);
  const players = useTournamentStore((state) => state.players);
  const setPlayers = useTournamentStore((state) => state.setPlayers);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStart = () => {
    // Фильтруем пустые строки и обнуляем chillZone
    const filteredPlayers = players
      .filter((p) => p.nickname || p.mmr || p.role)
      .map((p) => ({
        ...p,
        chillZone: 0, // обнуляем перед турниром
      }));

    setPlayers(filteredPlayers); // ✅ теперь тип соответствует Player[]
    closeModal();
    navigate("/tournament");
  };

  // Кнопка очистки списка игроков
  const handleClear = () => {
    if (window.confirm("Вы уверены, что хотите очистить всех участников?")) {
      setPlayers([
        {
          id: crypto.randomUUID(),
          nickname: "",
          mmr: "",
          role: "",
          ready: false,
          chillZone: 0,
        },
      ]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Создать турнир</h1>
        <button className={styles.clearBtn} onClick={handleClear}>
          Очистить
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <PlayerTable />
        <div className={styles.buttonWrapper}>
          <button onClick={openModal}>Создать</button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Выберите количество жизней</h2>
            <select
              value={lives}
              onChange={(e) => setLives(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <div className={styles.modalButtons}>
              <button className={styles.startBtn} onClick={handleStart}>
                Начать турнир
              </button>
              <button className={styles.closeBtn} onClick={closeModal}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTournament;
