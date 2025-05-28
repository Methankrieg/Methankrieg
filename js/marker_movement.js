
// ==============================
// marker_movement.js
// Steuerung für Markerbewegung in Echtzeit
// Unterstützt: Taktisch (animiert), Operativ (animiert), Transition (springend)
// ==============================

// Hilfsfunktion: Berechne SVG-Mittelpunkt eines Hexfeldes aus seiner ID (F-XXXX)
function berechneXY(hexId) {
  const match = hexId.match(/F-(\d{2})(\d{2})/);
  if (!match) return null;

  const zeile = parseInt(match[1], 10);  // 01–44 (von unten nach oben)
  const spalte = parseInt(match[2], 10); // 01–27 (von links nach rechts)

  // Exakte Maße aus dem SVG
  const hexBreite = 103.92000000000002;
  const hexHoehe  = 89.99735996127947;

  // Exakter Mittelpunkt von F-0101 aus dem Polygon
  const x0 = 51.960000000000015;
  const y0 = 3869.887358347899;

  // Gerade Zeilen sind eingerückt
  const xOffset = (zeile % 2 === 0) ? hexBreite / 2 : 0;

  const x = x0 + (spalte - 1) * hexBreite + xOffset;
  const y = y0 - (zeile - 1) * hexHoehe;

  return { x, y };
}


// Bewegung: SOFORTSPRUNG
function verschiebeMarker(markerId, zielHex) {
  const marker = document.getElementById(markerId);
  const pos = berechneXY(zielHex);
  if (marker && pos) {
    marker.setAttribute("transform", `translate(${pos.x - 25}, ${pos.y - 25})`);
    marker.setAttribute("data-hex", zielHex);
    console.log(`[SPRUNG] ${markerId} → ${zielHex} @ (${pos.x}, ${pos.y})`);
  }
}

// Bewegung: ANIMIERT
function verschiebeMarkerAnimiert(markerId, startHex, zielHex, dauer = 400) {
  const marker = document.getElementById(markerId);
  const start = berechneXY(startHex);
  const ziel = berechneXY(zielHex);
  if (!marker || !start || !ziel) return;

  let startTime = null;
  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / dauer, 1);
    const x = start.x + (ziel.x - start.x) * progress - 25;
    const y = start.y + (ziel.y - start.y) * progress - 25;
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

// Dispatcher: Bestimmt automatisch die Art der Bewegung
function bewegeMarker(markerId, startHex, zielHex, bewegungsart = "taktisch") {
  if (bewegungsart === "transition") {
    verschiebeMarker(markerId, zielHex); // sofort
  } else {
    verschiebeMarkerAnimiert(markerId, startHex, zielHex); // animiert
  }
}
// Funktion global verfügbar machen:
window.bewegeMarker = bewegeMarker;
