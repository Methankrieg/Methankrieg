
// =============================================
// lade_datenbanken.js – Initialisiert Spiellogik dynamisch
// =============================================

async function ladeDatenbanken() {
  const szenarioName = (window.gameState?.ziele?.szenario || "umkaempftes_casyat").toLowerCase();
  const szenarioPfad = `szenario_${szenarioName}.json`;

  const [
    navigation,
    dunkelwolken,
    sprungrouten,
    systeme,
    szenario,
    einheiten,
    admirale,
    sektoren
  ] = await Promise.all([
    fetch('erschwerte_navigation_felderdatenbank.json').then(r => r.json()),
    fetch('dunkelwolken_felder_datenbankjson').then(r => r.json()),
    fetch('sprungrouten_datenbank.json').then(r => r.json()),
    fetch('system_datenbank.json').then(r => r.json()),
    fetch(szenarioPfad).then(r => r.json()),
    fetch('einheiten_datenbank.json').then(r => r.json()),
    fetch('admirale_datenbank.json').then(r => r.json()),
    fetch('sektoren_datenbank.json').then(r => r.json())
  ]);

  // 🧭 Bewegungsrelevante Felder
  window.erschwerteNavigation = navigation.felder;
  window.dunkelwolkenFelder = dunkelwolken.felder;
  window.sprungroutenDaten = sprungrouten.sprungrouten;
  window.systeme = systeme;

  // 📦 Spielstanddaten
  window.startSzenario = szenario;
  window.einheitenDaten = einheiten;
  window.admiraleDaten = admirale;
  window.sektorenDaten = sektoren;

  // 🧱 Startaufstellung separat laden
const aufstellungsdatei = szenario.startaufstellung;
const startaufstellung = await fetch(aufstellungsdatei).then(r => r.json());
window.gameState = window.gameState || {};
window.gameState.startaufstellung = startaufstellung;

// 🔧 Bewegungseinträge initialisieren (für Kontextmenü "Bewege nach hier")
window.gameState.startaufstellung.forEach(einheit => {
  if (typeof einheit.bereitsBewegt === "undefined") einheit.bereitsBewegt = false;
  if (typeof einheit.bewegungsArt === "undefined") einheit.bewegungsArt = null;
});

// ✅ Erfolgsmeldung
console.log(`[INIT] Szenario "${szenarioName}" + Datenbanken erfolgreich geladen.`);
}
