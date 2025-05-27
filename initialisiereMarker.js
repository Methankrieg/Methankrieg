// ==============================================
// initialisiereMarker.js – Marker für Einheiten & Admirale setzen
// ==============================================

function initialisiereMarker(svg) {
  const markerLayer = svg.getElementById("Marker_13");
  if (!markerLayer) {
    console.warn("[FEHLER] Layer 'Marker_13' nicht gefunden!");
    return;
  }

  const startdaten = window.gameState?.startaufstellung || [];
  const einheitenDB = window.einheitenDaten || {};
  const admiraleDB = window.admiraleDaten || {};

  startdaten.forEach((einheit) => {
    const feldId = einheit.feld;
    const fraktion = einheit.fraktion;
    const name = einheit.einheit;
    const istAdmiral = name.startsWith("admiral_");

    // 📍 Koordinaten berechnen
    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }

    const { x, y } = pos;
    let markerElement = null;

    if (istAdmiral) {
      // Admiralname extrahieren (z. B. "Ruzik", "Grek-08", "Gonozal VII")
      const admiralName = name.replace("admiral_", "");

      const admiralData = admiraleDB?.[fraktion]?.[admiralName];
      if (!admiralData) {
        console.warn(`[FEHLER] Admiral '${admiralName}' nicht in Datenbank für Fraktion '${fraktion}' gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("class", `marker marker-${fraktion} marker-admiral`);
      markerElement.setAttribute("transform", `translate(${x - 22.5}, ${y - 22.5})`);
    } else {
      // Geschwadertyp korrekt extrahieren (z. B. "Kreuzergeschwader")
      const typ = name.split(". ")[1];
      const technologie = einheit.technologie;

      const template = einheitenDB?.[fraktion]?.[typ]?.[technologie];
      if (!template) {
        console.warn(`[FEHLER] Einheit "${name}" (${typ}/${technologie}) in Datenbank für Fraktion '${fraktion}' nicht gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker marker-${fraktion} marker-${typ.replace(/\s+/g, "_")}`);
      markerElement.setAttribute("transform", `translate(${x - 25}, ${y - 25})`);
    }

    if (markerElement) {
      markerElement.setAttribute("id", `marker-${feldId}-${name}`);
      markerElement.setAttribute("data-hex", feldId);
      markerElement.setAttribute("data-name", name);
      markerElement.addEventListener("contextmenu", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, feldId, "marker");
      });
      markerElement.classList.add("cursor-pointer");

      markerLayer.appendChild(markerElement);
      console.log(`[MARKER] ${name} (${istAdmiral ? "Admiral" : "Einheit"}) gesetzt auf ${feldId} → x:${x}, y:${y}`);
    }
  });

  console.log("[MARKER] Initiale Markerplatzierung abgeschlossen.");
}
