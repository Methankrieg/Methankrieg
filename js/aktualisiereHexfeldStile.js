// ===========================================
// aktualisiereHexfeldStile.js
// Hexfelder farblich und stilistisch markieren
// ===========================================

function aktualisiereHexfeldStile(svg) {
  if (!svg) {
    console.warn("[WARNUNG] SVG nicht übergeben an aktualisiereHexfeldStile.");
    return;
  }

  // Prüfe, ob die globalen Daten existieren
  if (!window.dunkelwolkenFelder || !window.navigationFelder || !window.systemeDatenbank) {
    console.warn("[WARNUNG] Datenbanken nicht geladen – dunkelwolkenFelder / navigationFelder / systemeDatenbank fehlen.");
    return;
  }

  // 🌀 Dunkelwolken markieren
  dunkelwolkenFelder.forEach(hexId => {
    const hex = svg.getElementById(hexId);
    if (hex) {
      hex.classList.add("dunkelwolke");
    }
  });

  // ⛅ Erschwerte Navigation markieren
  navigationFelder.forEach(hexId => {
    const hex = svg.getElementById(hexId);
    if (hex && !hex.classList.contains("dunkelwolke")) {
      hex.classList.add("navigation-erschwert");
    }
  });

  // 🪐 Systeme & Industriesysteme markieren
  systemeDatenbank.forEach(system => {
    const hex = svg.getElementById(system.hex);
    if (!hex) return;
    if (system.istIndustriesystem) {
      hex.classList.add("industriesystem");
    } else {
      hex.classList.add("system");
    }
  });

  console.log("[INIT] Hexfeld-Stile aktualisiert.");
}
