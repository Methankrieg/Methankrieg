// initialisiereMarker.js – Markerplatzierung exakt wie gefordert

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

    const pos = typeof berechneXY === "function" ? berechneXY(feldId) : null;
    if (!pos) {
      console.warn(`[FEHLER] Kann Koordinaten für ${feldId} nicht berechnen.`);
      return;
    }

    const { x, y } = pos;
    let markerElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    if (isAdmiral) {
      const admiralName = einheit.einheit.replace("admiral_", "").toLowerCase();
      const admiral = admiraleDB?.[fraktion]?.find(a => a.name.toLowerCase() === admiralName);

      if (!admiral) {
        console.warn(`[FEHLER] Admiral '${admiralName}' nicht in Datenbank für ${fraktion} gefunden.`);
        return;
      }

      const { breite, hoehe, klasse } = (
        fraktion === "arkoniden"
          ? { breite: 45, hoehe: 45, klasse: "marker-admiral marker-arkoniden" }
          : { breite: 20, hoehe: 40, klasse: "marker-admiral marker-maahks" }
      );

      markerElement.setAttribute("width", breite);
      markerElement.setAttribute("height", hoehe);
      markerElement.setAttribute("class", klasse);
      markerElement.setAttribute("transform", `translate(${x - breite / 2}, ${y - hoehe / 2})`);
    } else {
      const typ = einheit.einheit.split(". ")[1]?.split(" ")[0]?.toLowerCase();
      const technologie = einheit.technologie?.toLowerCase();
      const template = einheitenDB?.[fraktion]?.[typ]?.[technologie];

      if (!template) {
        console.warn(`[FEHLER] Einheit "${einheit.einheit}" (${typ}/${technologie}) nicht gefunden.`);
        return;
      }

      markerElement.setAttribute("width", 50);
      markerElement.setAttribute("height", 50);
      markerElement.setAttribute("class", `marker-einheit marker-${fraktion}`);
      markerElement.setAttribute("transform", `translate(${x - 25}, ${y - 25})`);
    }

    markerElement.setAttribute("id", `marker-${feldId}`);
    markerElement.setAttribute("data-hex", feldId);
    markerElement.setAttribute("data-name", einheit.einheit);
    markerElement.classList.add("cursor-pointer");

    markerElement.addEventListener("contextmenu", evt => {
      evt.preventDefault();
      evt.stopPropagation();
      showContextMenu(evt, feldId, "marker");
    });

    markerLayer.appendChild(markerElement);
    console.log(`[MARKER] ${einheit.einheit} (${isAdmiral ? "Admiral" : "Einheit"}) gesetzt auf ${feldId} (${fraktion}) → x:${x}, y:${y}`);
  });

  console.log("[MARKER] Initiale Markerplatzierung abgeschlossen.");
}
