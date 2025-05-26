
// ==============================
// marker_movement.js
// Steuerung für Markerbewegung in Echtzeit
// Unterstützt: Taktisch (animiert), Operativ (animiert), Transition (springend)
// ==============================

// Hilfsfunktion: Berechne SVG-Mittelpunkt eines Hexfeldes aus seiner ID (F-XXXX)
function berechneXY(hexId) {
  const match = hexId.match(/F-(\d{2})(\d{2})/);
  if (!match) return null;

  const r = parseInt(match[1], 10); // Zeile
  const q = parseInt(match[2], 10); // Spalte

  const hexBreite = 103.92;
  const hexHoehe  = 89.0;

  const x0 = 51.96;   // Mittelpunkt von F-0101.x
  const y0 = 3869.89; // Mittelpunkt von F-0101.y

  const x = x0 + (q - 1) * hexBreite;
  const yOffset = (q % 2 === 0) ? hexHoehe / 2 : 0; // ➜ gerade Spalten: Versatz
  const y = y0 - (r - 1) * hexHoehe - yOffset;

  return { x, y };
}


// Bewegung: SOFORTSPRUNG
function verschiebeMarker(markerId, zielHex) {
  const marker = document.getElementById(markerId);
  const pos = berechneXY(zielHex);
  if (marker && pos) {
    marker.setAttribute("transform", `translate(${pos.x}, ${pos.y})`);
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
    const x = start.x + (ziel.x - start.x) * progress;
    const y = start.y + (ziel.y - start.y) * progress;
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
