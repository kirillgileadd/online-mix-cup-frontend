import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateTournament from "./pages/CreateTournament/CreateTournament";
import TournamentPage from "./pages/TournamentPage/TournamentPage";
import LobbyPage from "./pages/LobbyPage/LobbyPage"; // новый импорт

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateTournament />} />
        <Route path="/tournament" element={<TournamentPage />} />
        <Route path="/lobbies" element={<LobbyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
