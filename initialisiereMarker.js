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
    const fraktion = einheit.fraktion?.toLowerCase() || "unbekannt";
    const isAdmiral = einheit.einheit.toLowerCase().startsWith("admiral_");

    // 📍 Koordinaten berechnen
    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }
    const { x, y } = pos;

    let markerElement = null;

    if (isAdmiral) {
      const nameRoh = einheit.einheit.replace("admiral_", "");
      const nameClean =
        fraktion === "maahks"
          ? nameRoh.trim()
          : nameRoh.trim().split(" ").map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toUpperCase()).join(" ");

      const admiralData = admiraleDB?.[fraktion]?.find(a => a.name === nameClean);

      if (!admiralData) {
        console.warn(`[FEHLER] Admiral '${nameClean}' nicht in Datenbank für ${fraktion} gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("class", `marker marker-${fraktion} marker-admiral`);
      markerElement.setAttribute("transform", `translate(${x - 22.5}, ${y - 22.5})`);
    } else {
      const typSegment = einheit.einheit.split(". ")[1] || "";
      const typ = typSegment.split(" ")[1]?.toLowerCase();
      const technologie = einheit.technologie?.toLowerCase();
      const template = einheitenDB?.[fraktion]?.[typ]?.[technologie];

      if (!template) {
        console.warn(`[FEHLER] Einheit "${einheit.einheit}" (${typ}/${technologie}) nicht gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker marker-${fraktion} marker-einheit`);
      markerElement.setAttribute("transform", `translate(${x - 25}, ${y - 25})`);
    }

    if (markerElement) {
      markerElement.setAttribute("id", `marker-${feldId}-${einheit.einheit}`);
      markerElement.setAttribute("data-hex", feldId);
      markerElement.setAttribute("data-name", einheit.einheit);

      // 🔁 Event-Handler
      markerElement.addEventListener("contextmenu", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, feldId, "marker");
      });

      markerElement.addEventListener("click", evt => {
        evt.stopPropagation();
        clearSelection(); // wenn vorhanden
        markerElement.classList.add("selected");
        console.log(`[KLICK] Marker ausgewählt: ${einheit.einheit}`);
      });

      markerElement.classList.add("cursor-pointer");

      markerLayer.appendChild(markerElement);
      console.log(`[MARKER] ${einheit.einheit} (${isAdmiral ? "Admiral" : "Einheit"}) → ${feldId} (${fraktion}) – x:${x}, y:${y}`);
    }
  });

  console.log("[MARKER] Alle Marker erfolgreich platziert.");
}
