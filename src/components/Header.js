import React from "react";
import "./Header.css";

function Header({ currentPage, onNavigate }) {
  return (
    <header className="app-header">
      <h1>Sudoku: React & JavaScript</h1>
      <nav className="navigation">
        <button className={currentPage === "game" ? "active" : ""} onClick={() => onNavigate("game")}>
          Play
        </button>
        <button className={currentPage === "solver" ? "active" : ""} onClick={() => onNavigate("solver")}>
          Solver
        </button>
      </nav>
    </header>
  );
}

export default Header;
