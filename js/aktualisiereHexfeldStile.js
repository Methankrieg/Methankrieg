function aktualisiereHexfeldStile(svg) {
  if (!svg) {
    console.warn("[WARNUNG] SVG nicht übergeben an aktualisiereHexfeldStile.");
    return;
  }

  const dunkelwolken = window.dunkelwolkenFelder;
  const navigation = window.erschwerteNavigationFelder;
  const systeme = window.systemeDaten;

  if (!dunkelwolken || !navigation || !systeme) {
    console.warn("[WARNUNG] Datenbanken nicht vollständig geladen – dunkelwolkenFelder / erschwerteNavigationFelder / systemeDaten fehlen.");
    return;
  }

  // 🌀 Dunkelwolken markieren
  for (const hexId of dunkelwolken) {
    const hex = svg.getElementById(hexId);
    if (hex) hex.classList.add("dunkelwolke");
  }

  // ⛅ Erschwerte Navigation markieren (nur wenn nicht schon dunkelwolke)
  for (const hexId of navigation) {
    const hex = svg.getElementById(hexId);
    if (hex && !hex.classList.contains("dunkelwolke")) {
      hex.classList.add("navigation-erschwert");
    }
  }

  // 🪐 Systeme & Industriesysteme markieren
  for (const system of systeme) {
    const hex = svg.getElementById(system.hex);
    if (!hex) continue;
    hex.classList.add(system.istIndustriesystem ? "industriesystem" : "system");
  }

  console.log("[INIT] Hexfeld-Stile aktualisiert.");
}
