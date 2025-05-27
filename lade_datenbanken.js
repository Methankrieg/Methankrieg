
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
    fetch('erschwerte_navigation_felder_final_v2.json').then(r => r.json()),
    fetch('dunkelwolken_felder_final_v2.json').then(r => r.json()),
    fetch('sprungrouten_datenbank_erkud_luvanaar_v2.json').then(r => r.json()),
    fetch('system_datenbank_bereinigt_v3.json').then(r => r.json()),
    fetch(szenarioPfad).then(r => r.json()),
    fetch('einheiten_datenbank_final_v2.json').then(r => r.json()),
    fetch('admirale_datenbank__template_v3.json').then(r => r.json()),
    fetch('sektor_datenbank_luvanaar_erkud_final_v5.json').then(r => r.json())
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

  console.log(`[INIT] Szenario "${szenarioName}" + Datenbanken erfolgreich geladen.`);
}
