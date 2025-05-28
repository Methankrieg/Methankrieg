// initialisiereMarker.js – Markerplatzierung mit Debug, Events und Stil

function initialisiereMarker(svg) {
  const markerLayer = svg.getElementById("Marker_13");
  if (!markerLayer) {
    console.warn("[FEHLER] Layer 'Marker_13' nicht gefunden!");
    return;
  }

  const startdaten = window.gameState?.startaufstellung || [];
  const einheitenDB = window.einheitenDaten || {};
  const admiraleDB = window.admiraleDaten || [];

  startdaten.forEach((einheit) => {
    const feldId = einheit.feld;
    const fraktion = einheit.fraktion?.toLowerCase() || "unbekannt";
    const name = einheit.einheit;
    const technologie = einheit.technologie;

    // Typ vorab definieren, auch wenn Admiral
    const typMatch = name.match(/^\d+\.\s(.+)$/);
    const typ = typMatch ? typMatch[1].trim() : "unbekannt";

    const isAdmiral = name.startsWith("Admiral ");

    // 📍 Koordinaten
    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }
    const { x, y } = pos;
    let markerElement = null;

    if (isAdmiral) {
      const admiralName = name.replace("Admiral ", "").trim();
      const admiralData = Array.isArray(admiraleDB)
        ? admiraleDB.find(a =>
            a.fraktion?.toLowerCase() === fraktion &&
            a.einheit?.endsWith(admiralName)
          )
        : null;

      if (!admiralData) {
        console.warn(`[FEHLER] Admiral '${admiralName}' nicht in Datenbank für Fraktion '${fraktion}' gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("transform", `translate(${x - 22.5}, ${y - 22.5})`);
      markerElement.setAttribute("class", `marker marker-admiral marker-${fraktion}`);

    } else {
      const cssTyp = typ.toLowerCase().replace(/\s+/g, "_");
      const einheitsTemplate = einheitenDB?.[fraktion]?.[typ]?.[technologie];
      if (!einheitsTemplate) {
        console.warn(`[FEHLER] Einheit "${name}" (${typ}/${technologie}) in Datenbank für Fraktion '${fraktion}' nicht gefunden.`);
        return;
      }

      markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("transform", `translate(${x - 25}, ${y - 25})`);
      markerElement.setAttribute("class", `marker marker-einheit marker-${fraktion} marker-${cssTyp}`);
    }

    // 🖱️ Interaktionen
    if (markerElement) {
      markerElement.setAttribute("id", `marker-${feldId}-${name}`);
      markerElement.setAttribute("data-hex", feldId);
      markerElement.setAttribute("data-name", name);
      markerElement.setAttribute("data-typ", typ);

      markerElement.addEventListener("contextmenu", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, feldId, "marker");
      });

      markerElement.addEventListener("click", evt => {
        evt.stopPropagation();
        deselectAllMarker();
        markerElement.classList.add("selected");
        console.log(`[KLICK] Marker ${name} auf ${feldId} ausgewählt.`);
      });

      markerLayer.appendChild(markerElement);
      console.log(`[MARKER] ${name} (${isAdmiral ? "Admiral" : "Einheit"}) gesetzt auf ${feldId} → x:${x}, y:${y}`);
    }
  });

  console.log("[MARKER] Initiale Markerplatzierung abgeschlossen.");
}

function deselectAllMarker() {
  document.querySelectorAll(".marker.selected").forEach(m => m.classList.remove("selected"));
}
