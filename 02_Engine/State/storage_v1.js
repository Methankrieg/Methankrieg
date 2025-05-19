
function saveGameState() {
  try {
    gameState.letzterSpeicherzeitpunkt = new Date().toISOString();
    const dataStr = JSON.stringify(gameState, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = gameState.spielname + "_savegame.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("Spielstand exportiert.");
  } catch (e) {
    console.error("Fehler beim Speichern:", e);
  }
}

function loadGameStateFromFile(inputElement) {
  const file = inputElement.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const loadedState = JSON.parse(event.target.result);
      Object.assign(gameState, loadedState);
      console.log("Spielstand erfolgreich geladen.");
    } catch (e) {
      console.error("Fehler beim Laden:", e);
    }
  };
  reader.readAsText(file);
}
