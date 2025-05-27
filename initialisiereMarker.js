
// initialisiereMarker_debug.js
// Erstellt Marker für Einheiten und Admiräle aus der startaufstellung
// Debugversion mit ausführlicher Konsolenausgabe

function initialisiereMarker(svg) {
  const markerLayer = svg.getElementById("Marker_13");
  if (!markerLayer) {
    console.warn("[FEHLER] Layer 'Marker_13' nicht gefunden!");
    return;
  }

  const startdaten = window.gameState?.startaufstellung || [];
  const einheitenDB = window.einheitenDaten || {};
  const admiraleDB = window.admiraleDaten || {};

  startdaten.forEach((einheit, index) => {
    const feldId = einheit.feld;
    const hex = svg.getElementById(feldId);

    if (!hex) {
      console.warn(`[FEHLER] Feld ${feldId} nicht im SVG gefunden – Marker ${einheit.einheit} wird NICHT gesetzt.`);
      return;
    }

    const bbox = hex.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const isAdmiral = einheit.einheit.startsWith("admiral_");
    const fraktion = einheit.fraktion.toLowerCase();

    let markerElement = null;

    if (isAdmiral) {
      const admiralId = einheit.einheit.split("_")[1];
      const admiralData = admiraleDB?.[fraktion]?.[admiralId];

      if (!admiralData) {
        console.warn(`[FEHLER] Admiral '${admiralId}' nicht in Datenbank für ${fraktion} gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("x", cx - 22.5);
      markerElement.setAttribute("y", cy - 22.5);
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("class", `marker-admiral marker-${fraktion}`);
    } else {
      const typ = einheit.einheit.split(". ")[1]?.split(" ")[0]?.toLowerCase();
      const technologie = einheit.technologie?.toLowerCase();

      const template = einheitenDB?.[fraktion]?.[typ]?.[technologie];

      if (!template) {
        console.warn(`[FEHLER] Einheit "${einheit.einheit}" (${typ}/${technologie}) in ${fraktion} nicht gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("x", cx - 25);
      markerElement.setAttribute("y", cy - 25);
      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker-einheit marker-${fraktion}`);
    }

    if (markerElement) {
      markerElement.setAttribute("id", `marker-${feldId}`);
      markerElement.setAttribute("data-hex", feldId);
      markerElement.setAttribute("data-name", einheit.einheit);
      markerLayer.appendChild(markerElement);

      console.log(`[MARKER] ${einheit.einheit} gesetzt auf ${feldId} (${fraktion})`);
    }
  });

  console.log(`[MARKER] Alle Marker wurden ins SVG gesetzt.`);
}
