const gameState = {
  runde: 1,
  aktivePhase: 1,
  aktiveFraktion: "Arkoniden",
  phaseDone: {
    1: false, 2: false, 3: false, 4: false,
    5: false, 6: false, 7: false, 8: false
  },
  einheiten: [
    {
      einheit: "33. Kreuzergeschwader",
      typ: "geschwader",
      position: "F-3611"
    }
  ],
  admirale: [
    {
      einheit: "Ruzik",
      position: "F-3611"
    }
  ],
  karte: {},
  sektoren: {},
  ziele: {
    feldzug: "",
    szenario: "",
    aufgaben: [],
    siegstatus: "offen"
  },
  debugLog: [],
  spielname: "Prototyp Umkämpftes Casyat",
  letzterSpeicherzeitpunkt: null
};