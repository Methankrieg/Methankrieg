
const gameState = {
  runde: 1,
  aktivePhase: 1,
  aktiveFraktion: "Arkoniden",
  phaseDone: {
    1: false, 2: false, 3: false, 4: false,
    5: false, 6: false, 7: false, 8: false
  },
  einheiten: [],
  admirale: [],
  karte: {},
  sektoren: {},
  ziele: {
    feldzug: "",
    szenario: "",
    aufgaben: [],
    siegstatus: "offen"
  },
  debugLog: [],
  spielname: "Unbenannt",
  letzterSpeicherzeitpunkt: null
};
