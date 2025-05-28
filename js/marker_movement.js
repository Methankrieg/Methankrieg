// ==============================
// marker_movement.js – Bewegung von Markern auf Hexfeldkarte
// Unterstützt: Taktisch (animiert), Operativ (animiert), Transition (sofort)
// ==============================

// Hilfsfunktion: Berechne SVG-Mittelpunkt eines Hexfeldes anhand seiner ID (z. B. F-0111)
function berechneXY(hexId) {
  const match = hexId.match(/F-(\d{2})(\d{2})/);
  if (!match) {
    console.warn(`[WARNUNG] Ungültige Hexfeld-ID übergeben: "${hexId}"`);
    return null;
  }

  const zeile = parseInt(match[1], 10);   // 01–44
  const spalte = parseInt(match[2], 10);  // 01–27

  const hexBreite = 103.92;
  const hexHoehe = 89.99735996127947;

  const x0 = 51.96;
  const y0 = 3869.887358347899;

  const xOffset = (zeile % 2 === 0) ? hexBreite / 2 : 0;
  const x = x0 + (spalte - 1) * hexBreite + xOffset;
  const y = y0 - (zeile - 1) * hexHoehe;

  return { x, y };
}

// Bewegung: Sofortiges Versetzen (z. B. bei Transition)
function verschiebeMarker(markerId, zielHex) {
  const marker = document.getElementById(markerId);
  const pos = berechneXY(zielHex);

  if (!marker || !pos) {
    console.warn(`[FEHLER] Marker "${markerId}" oder Zielposition "${zielHex}" nicht gefunden.`);
    return;
  }

  const offsetX = marker.getAttribute("width") / 2;
  const offsetY = marker.getAttribute("height") / 2;
  marker.setAttribute("transform", `translate(${pos.x - offsetX}, ${pos.y - offsetY})`);
  marker.setAttribute("data-hex", zielHex);
  console.log(`[SPRUNG] ${markerId} → ${zielHex}`);
}

// Bewegung: Animiertes Verschieben (z. B. bei taktisch oder operativ)
function verschiebeMarkerAnimiert(markerId, startHex, zielHex, dauer = 400) {
  const marker = document.getElementById(markerId);
  const start = berechneXY(startHex);
  const ziel = berechneXY(zielHex);

  if (!marker || !start || !ziel) {
    console.warn(`[FEHLER] Markerbewegung abgebrochen – Daten unvollständig (${markerId}, ${startHex}, ${zielHex})`);
    return;
  }

  const offsetX = marker.getAttribute("width") / 2;
  const offsetY = marker.getAttribute("height") / 2;

  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / dauer, 1);
    const x = start.x + (ziel.x - start.x) * progress - offsetX;
    const y = start.y + (ziel.y - start.y) * progress - offsetY;

    marker.setAttribute("transform", `translate(${x}, ${y})`);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      marker.setAttribute("data-hex", zielHex);
      console.log(`[ANIMIERT] ${markerId} bewegt zu ${zielHex}`);
    }
  }

  requestAnimationFrame(step);
}

// Dispatcher: Bestimmt Art der Bewegung
function bewegeMarker(markerId, startHex, zielHex, bewegungsart = "taktisch") {
  if (!markerId || !startHex || !zielHex) {
    console.warn(`[WARNUNG] Unvollständige Bewegungsdaten: ${markerId}, ${startHex}, ${zielHex}`);
    return;
  }

  switch (bewegungsart) {
    case "transition":
      verschiebeMarker(markerId, zielHex);
      break;
    case "taktisch":
    case "operativ":
      verschiebeMarkerAnimiert(markerId, startHex, zielHex);
      break;
    default:
      console.warn(`[WARNUNG] Unbekannte Bewegungsart "${bewegungsart}".`);
  }
}

// Globale Bereitstellung
window.bewegeMarker = bewegeMarker;
window.berechneXY = berechneXY;
