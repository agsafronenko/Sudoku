import React, { useState } from "react";

import GameBoard from "./components/GameBoard";
import SolverPage from "./components/SolverPage";
import Header from "./components/Header";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("game");

  return (
    <div className="app-container">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="main-content">{currentPage === "game" ? <GameBoard /> : <SolverPage />}</div>
    </div>
  );
}

export default App;
