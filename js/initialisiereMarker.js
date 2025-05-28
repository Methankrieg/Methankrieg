// initialisiereMarker.js – Markerplatzierung mit CSS-Zuweisung, Debug, Events

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

    // Einheitstyp (z. B. "Kreuzergeschwader")
    const typMatch = name.match(/^\d+\.\s(.+)$/);
    const typ = typMatch ? typMatch[1].trim() : name;

    // 🔍 Admiral-Erkennung auf Basis von Datenbank-Eintrag (nicht mehr "Admiral " prüfen)
    const admiralData = Array.isArray(admiraleDB)
      ? admiraleDB.find(a =>
          a.fraktion?.toLowerCase() === fraktion &&
          a.einheit?.toLowerCase() === name.toLowerCase()
        )
      : null;

    const isAdmiral = !!admiralData;

    // 📍 Koordinaten berechnen
    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }
    const { x, y } = pos;

    let markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    if (isAdmiral) {
      // ⬛ Admiral-Marker
      markerElement.setAttribute("width", 45);
      markerElement.setAttribute("height", 45);
      markerElement.setAttribute("class", `marker marker-${fraktion}-admiral`);
    } else {
      // 🔺 Normale Einheit
      const einheitsTemplate = einheitenDB?.[fraktion]?.[typ]?.[technologie];
      if (!einheitsTemplate) {
        console.warn(`[FEHLER] Einheit "${name}" (${typ}/${technologie}) in Datenbank für Fraktion '${fraktion}' nicht gefunden.`);
        return;
      }

      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker marker-${fraktion}`);
    }

    // 🔧 Gemeinsame Attribute
    const centerOffset = parseFloat(markerElement.getAttribute("width")) / 2;
    markerElement.setAttribute("transform", `translate(${x - centerOffset}, ${y - centerOffset})`);
    markerElement.setAttribute("id", `marker-${feldId}-${name}`);
    markerElement.setAttribute("data-hex", feldId);
    markerElement.setAttribute("data-name", name);
    markerElement.setAttribute("data-typ", typ);
    markerElement.setAttribute("data-fraktion", fraktion);
    markerElement.setAttribute("data-markerid", `marker-${name.replace(/\s/g, "_")}`);

    // 🖱️ Interaktionen
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

    // ➕ Einfügen ins SVG
    markerLayer.appendChild(markerElement);
    console.log(`[MARKER] ${name} (${isAdmiral ? "Admiral" : "Einheit"}) gesetzt auf ${feldId} → x:${x}, y:${y}`);
  });

  console.log("[MARKER] Initiale Markerplatzierung abgeschlossen.");
}

function deselectAllMarker() {
  document.querySelectorAll(".marker.selected").forEach(m => m.classList.remove("selected"));
}
