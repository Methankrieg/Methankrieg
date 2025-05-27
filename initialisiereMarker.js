
// ==============================================
// initialisiereMarker.js – Marker für Einheiten & Admirale setzen
// ==============================================

function initialisiereMarker(svg) {
  const layer = svg.getElementById("Marker_13");
  if (!layer) {
    console.error("[FEHLER] Layer 'Marker_13' nicht gefunden.");
    return;
  }

  if (!window.startaufstellung_daten || !window.einheiten_datenbank || !window.admirale_datenbank) {
    console.error("[FEHLER] Benötigte Datenbanken nicht geladen.");
    return;
  }

  const startdaten = window.startaufstellung_daten;
  const einheitenDB = window.einheiten_datenbank;
  const admiralDB = window.admirale_datenbank;

  startdaten.forEach(einheit => {
    const name = einheit.einheit;
    const fraktion = einheit.fraktion.toLowerCase();
    const feld = einheit.feld;

    // 👉 Position berechnen
    const pos = typeof berechneXY === "function" ? berechneXY(feld) : null;
    if (!pos) {
      console.warn(`[⚠️ FEHLER] Koordinaten für ${name} auf ${feld} nicht berechnet.`);
      return;
    }

    const marker = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    let markerKlasse = "";
    let breite = 50;
    let hoehe = 50;

    // 👉 Admiral oder Einheit unterscheiden
    const istAdmiral = name.toLowerCase().startsWith("admiral_");

    if (istAdmiral) {
      const admiralName = name.replace("admiral_", "").toLowerCase();
      const admiral = admiralDB[fraktion]?.find(a => a.name.toLowerCase() === admiralName);
      if (!admiral) {
        console.warn(`[⚠️ FEHLER] Admiral "${admiralName}" nicht in Datenbank für ${fraktion} gefunden.`);
        return;
      }

      // Größe & Klasse je Fraktion
      if (fraktion === "arkoniden") {
        breite = 45;
        hoehe = 45;
        markerKlasse = "marker marker-arkoniden marker-arkoniden-admiral";
      } else {
        breite = 20;
        hoehe = 40;
        markerKlasse = "marker marker-maahks marker-maahks-admiral";
      }
    } else {
      const technologie = einheit.technologie?.toLowerCase();
      const typ = name.split(". ")[1]; // z. B. "einsatzgeschwader"
      const einheitsTemplate = einheitenDB[fraktion]?.[technologie]?.find(e => e.typ === typ);

      if (!einheitsTemplate) {
        console.warn(`[⚠️ FEHLER] Einheit "${name}" (${typ}/${technologie}) in ${fraktion} nicht gefunden.`);
        return;
      }

      markerKlasse = `marker marker-${fraktion} marker-${fraktion}-${typ}`;
    }

    marker.setAttribute("x", pos.x);
    marker.setAttribute("y", pos.y);
    marker.setAttribute("width", breite);
    marker.setAttribute("height", hoehe);
    marker.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
    marker.setAttribute("class", markerKlasse);
    marker.setAttribute("data-hex", feld);
    marker.setAttribute("id", "marker-" + feld);

    // 👉 Event-Handler: Kontextmenü
    marker.addEventListener("contextmenu", evt => {
      evt.preventDefault();
      evt.stopPropagation();
      showContextMenu(evt, feld, "marker");
    });

    // 👉 Cursor
    marker.classList.add("cursor-pointer");

    layer.appendChild(marker);
    console.log(`[MARKER] ${name} (${istAdmiral ? "Admiral" : "Einheit"}) → ${feld} gesetzt (${pos.x}, ${pos.y})`);
  });
}
