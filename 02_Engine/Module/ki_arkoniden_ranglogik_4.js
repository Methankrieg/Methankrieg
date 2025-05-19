
// Zugriff auf KI-Rangverhalten
let kiRangverhalten = {};

fetch("../../Module/ki_rangverhalten.json")
  .then(response => response.json())
  .then(data => {
    kiRangverhalten = data;
    console.log("Rangverhalten geladen.");
  });

function bewerteRangverhalten(rang) {
  const norm = rang.toLowerCase().replace(/[^a-z0-9\-_]/g, "");
  return kiRangverhalten[norm] || kiRangverhalten["default"];
}


/**
 * KI-Modul für die Arkoniden in "Der Methankrieg"
 * Nutzung der zentralen Zugriffsfunktion aus einheiten_zugriff.js
 */

let einheitenDatenbank = {};

// Zugriff über zentrales Modul
function initArkonidenKI(state, datenbank) {
    einheitenDatenbank = datenbank;
    console.log("Arkoniden-KI initialisiert mit offizieller Einheiten-Datenbank.");
}

// Beispiel: Produktion greift auf zentrale Zugriffsfunktion zu
function berechneArkonidenProduktion(state) {
    const garde = ladeEinheit(einheitenDatenbank, "arkoniden", "imperatorengarde", "state_of_the_art");
    if (garde) {
        console.log("Arkoniden planen Bau einer Imperatorengarde:", garde);
        // Produktionslogik folgt
    }
}

// Weitere KI-Funktionen
function bewegeArkonidenStrategisch(state) { }
function reagiereArkonidenOperativ(state) { }
function rueckzugslogikArkoniden(state) { }
function evaluiereImperialeSonderregeln(state) { }
function entscheideGardeVerwendung(state) { }
function sendeArkonidenLernDaten(resultate) { }