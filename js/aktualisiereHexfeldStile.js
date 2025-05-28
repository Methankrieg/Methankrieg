function aktualisiereHexfeldStile(svg) {
  if (!svg) {
    console.warn("[WARNUNG] SVG nicht übergeben an aktualisiereHexfeldStile.");
    return;
  }

  const dunkelwolkenFelder = window.dunkelwolkenFelder;
  const navigationFelder = window.erschwerteNavigationFelder;
  const systemeDaten = window.systemeDaten;

  if (!dunkelwolkenFelder || !navigationFelder || !systemeDaten) {
    console.warn("[WARNUNG] Datenbanken nicht geladen – dunkelwolkenFelder / erschwerteNavigationFelder / systemeDaten fehlen.");
    return;
  }

  // 🌀 Dunkelwolken markieren
  dunkelwolkenFelder.forEach(hexId => {
    const hex = svg.getElementById(hexId);
    if (hex) hex.classList.add("dunkelwolke");
  });

  // ⛅ Erschwerte Navigation markieren (wenn nicht schon Dunkelwolke)
  navigationFelder.forEach(hexId => {
    const hex = svg.getElementById(hexId);
    if (hex && !hex.classList.contains("dunkelwolke")) {
      hex.classList.add("navigation-erschwert");
    }
  });

  // 🪐 Systeme & Industriesysteme markieren
  Object.values(systemeDaten).forEach(system => {
    const hex = svg.getElementById(system.hex);
    if (!hex) return;
    hex.classList.add(system.istIndustriesystem ? "industriesystem" : "system");
  });

  console.log("[INIT] Hexfeld-Stile aktualisiert.");
}
