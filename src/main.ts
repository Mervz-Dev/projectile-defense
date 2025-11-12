import StartGame from "./game/main";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  // Get a specific parameter (e.g. 'name')
  const playerName = params.get("name") || "Guest-Itch";

  StartGame("game-container", { name: playerName });
});
