// ==========================================
// initialisiereMarker.js – Marker ins SVG setzen
// ==========================================

function initialisiereMarker(svg) {
  const layer = svg.getElementById("Marker_13");
  if (!layer) {
    console.warn("[WARNUNG] Marker-Layer 'Marker_13' nicht gefunden.");
    return;
  }

  if (!gameState.startaufstellung || !Array.isArray(gameState.startaufstellung)) {
    console.warn("[WARNUNG] Keine gültige Startaufstellung gefunden.");
    return;
  }

  gameState.startaufstellung.forEach(einheit => {
    const feld = einheit.feld;
    const markerId = "marker-" + feld;
    const isAdmiral = einheit.einheit.startsWith("admiral_");
    const fraktion = einheit.fraktion;

    let cssKlasse = "marker-unbekannt";

    if (isAdmiral) {
      // 🔹 Admiral: z. B. "admiral_ruzik" → "Ruzik"
      const name = einheit.einheit.replace("admiral_", "").replace(/^\w/, c => c.toUpperCase());
      if (admiraleDaten[fraktion] && admiraleDaten[fraktion][name]) {
        cssKlasse = "marker-admiral-" + fraktion;
      } else {
        console.warn(`[WARNUNG] Admiral "${name}" in ${fraktion} nicht gefunden.`);
      }
    } else {
      // 🔹 Normale Einheit
      const nameOhneNummer = einheit.einheit.replace(/^\d+\.\s*/, "").toLowerCase();
      const technologie = einheit.technologie || "standard";
      if (
        einheitenDaten[fraktion] &&
        einheitenDaten[fraktion][nameOhneNummer] &&
        einheitenDaten[fraktion][nameOhneNummer][technologie]
      ) {
        cssKlasse = "marker-" + fraktion;
      } else {
        console.warn(`[WARNUNG] Einheit "${einheit.einheit}" (${nameOhneNummer}) in ${fraktion}/${technologie} nicht gefunden.`);
      }
    }

    // 🔸 Erzeuge SVG-Element (hier: Rechteck – kann später angepasst werden)
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "50");
    rect.setAttribute("height", "50");
    rect.setAttribute("data-hex", feld);
    rect.setAttribute("id", markerId);
    rect.setAttribute("class", cssKlasse);
    rect.setAttribute("transform", `translate(0, 0)`); // spätere Positionierung: dynamisch ersetzen
    rect.setAttribute("cursor", "pointer");

    layer.appendChild(rect);
  });

  console.log("[MARKER] Alle Marker wurden ins SVG gesetzt.");
}
