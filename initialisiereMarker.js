// initialisiereMarker.js – Marker für Einheiten & Admirale setzen

function initialisiereMarker(svg) {
  const markerLayer = svg.getElementById("Marker_13");
  if (!markerLayer) {
    console.warn("[FEHLER] Layer 'Marker_13' nicht gefunden!");
    return;
  }

  const startdaten = window.gameState?.startaufstellung || [];
  const einheitenDB = window.einheiten_datenbank || {};
  const admiraleDB = window.admirale_datenbank || {};

  startdaten.forEach((einheit) => {
    const feldId = einheit.feld;
    const fraktion = einheit.fraktion?.toLowerCase() || "unbekannt";
    const isAdmiral = einheit.einheit.toLowerCase().startsWith("admiral_");

    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }
    const { x, y } = pos;

    let markerElement = null;

    if (isAdmiral) {
      const admiralId = einheit.einheit.replace("admiral_", "").toLowerCase();
      const admiralObjekte = admiraleDB?.[fraktion];
      const admiralData = admiralObjekte?.find(a => a.name.toLowerCase() === admiralId);

      if (!admiralData) {
        console.warn(`[FEHLER] Admiral '${admiralId}' nicht in Datenbank für ${fraktion} gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("class", `marker-admiral marker-${fraktion}`);
      markerElement.setAttribute("transform", `translate(${x - 22.5}, ${y - 22.5})`);
    } else {
      const typ = einheit.einheit.split(". ")[1]?.split(" ")[0]?.toLowerCase();
      const technologie = einheit.technologie?.toLowerCase();
      const template = einheitenDB?.[fraktion]?.[typ]?.[technologie];

      if (!template) {
        console.warn(`[FEHLER] Einheit "${einheit.einheit}" (${typ}/${technologie}) nicht gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker-einheit marker-${fraktion}`);
      markerElement.setAttribute("transform", `translate(${x - 25}, ${y - 25})`);
    }

    if (markerElement) {
      markerElement.setAttribute("id", `marker-${feldId}`);
      markerElement.setAttribute("data-hex", feldId);
      markerElement.setAttribute("data-name", einheit.einheit);

      // Rechtsklick: Kontextmenü
      markerElement.addEventListener("contextmenu", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, feldId, "marker");
      });

      // Linksklick: Auswahl
      markerElement.addEventListener("click", evt => {
        evt.stopPropagation();
        selectElement(markerElement);
      });

      markerElement.classList.add("cursor-pointer");

      markerLayer.appendChild(markerElement);
      console.log(`[MARKER] ${einheit.einheit} gesetzt auf ${feldId} (${fraktion}) → x:${x}, y:${y}`);
    }
  });

  console.log("[MARKER] Initiale Markerplatzierung abgeschlossen.");
}
