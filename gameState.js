// gameState_Template.js – Vorlage für neuen Spielstart (Mai 2025)

window.gameState = {
  "runde": null, // 🔄 Wird dynamisch aus Szenario gesetzt (z. B. startrunde oder 1)
  "aktivePhase": 1,
  "aktiveFraktion": "arkoniden",
  "phaseDone": {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false
  },
  "einheiten": [],       // 🧩 Aktuelle Spiel-Einheiten (wird im Spielverlauf befüllt)
  "admirale": [],        // 🧩 Aktive Admirale (wird dynamisch befüllt)
  "karte": {},           // 📍 Sichtbarkeit, Statusinfos zu Hexfeldern
  "sektoren": {},        // 🗺️ Zustände und Besitz pro Sektor
  "ziele": {
    "szenario": ""       // 🔄 Wird aus Szenario-Datei gesetzt
  },
  "debugLog": [],
  "spielname": "Neues Spiel",
  "letzterSpeicherzeitpunkt": null,
  "startaufstellung": [] // 🔄 Wird separat aus Datei geladen
};
