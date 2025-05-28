// initialisiereMarker.js – strukturierte Markerplatzierung mit CSS-Zuweisung und Events

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
    const name = einheit.einheit;
    const technologie = einheit.technologie;

    // Einheitstyp (z. B. "Kreuzergeschwader")
    const typMatch = name.match(/^\d+\.\s(.+)$/);
    const typ = typMatch ? typMatch[1].trim() : name;

    // 📍 Koordinaten berechnen
    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }
    const { x, y } = pos;

    // 🧠 Markerparameter bestimmen
    let markerKlasse = "";
    let markerBreite = 50;
    let markerHoehe = 50;

    // ✅ NEU: Admiral-Erkennung über Objektstruktur
    const admiralFraktion = admiraleDB?.[fraktion];
    const admiralData = admiralFraktion
      ? Object.values(admiralFraktion).find(a =>
          a.einheit?.toLowerCase() === name.toLowerCase()
        )
      : null;

    const isAdmiral = !!admiralData;

    if (isAdmiral) {
      const cssFraktion = fraktion === "maahks" ? "maahk" : "arkoniden";
      markerKlasse = `marker marker-${cssFraktion}-admiral`;
      markerBreite = 45;
      markerHoehe = 45;
    } else {
      const einheitsTemplate = einheitenDB?.[fraktion]?.[typ]?.[technologie];
      if (!einheitsTemplate) {
        console.warn(`[FEHLER] Einheit "${name}" (${typ}/${technologie}) in Datenbank für Fraktion '${fraktion}' nicht gefunden.`);
        return;
      }
      markerKlasse = `marker marker-${fraktion}`;
    }

    // 🎯 Marker erzeugen
    const markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    markerElement.setAttribute("width", markerBreite);
    markerElement.setAttribute("height", markerHoehe);
    markerElement.setAttribute("class", markerKlasse);
    markerElement.classList.add("cursor-pointer"); // optionaler Cursor-Stil

    const offset = markerBreite / 2;
    markerElement.setAttribute("transform", `translate(${x - offset}, ${y - offset})`);
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
