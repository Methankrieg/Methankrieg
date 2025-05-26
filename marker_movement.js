
// ==============================
// marker_movement.js
// Steuerung für Markerbewegung in Echtzeit
// Unterstützt: Taktisch (animiert), Operativ (animiert), Transition (springend)
// ==============================

// Hilfsfunktion: Berechne SVG-Mittelpunkt eines Hexfeldes aus seiner ID (F-XXXX)
function berechneXY(hexId) {
  const match = hexId.match(/F-(\d{2})(\d{2})/);
  if (!match) return null;

  const zeile = parseInt(match[1], 10); // 01–44 (von unten nach oben)
  const spalte = parseInt(match[2], 10); // 01–27 (von links nach rechts)

  // Maße – basierend auf SVG-Hexstruktur
  const hexBreite = 103.92; // Abstand von Spitze zu Spitze in X
  const hexHoehe = 89.0;    // Abstand zwischen Hex-Zentren in Y

  const x0 = 51.96;         // Zentrum F-0101.x
  const y0 = 3869.89;       // Zentrum F-0101.y

  // Halber Versatz bei **geraden Zeilen** (nicht Spalten!)
  const xOffset = (zeile % 2 === 0) ? hexBreite / 2 : 0;

  const x = x0 + (spalte - 1) * hexBreite + xOffset;
  const y = y0 - (zeile - 1) * hexHoehe;

  return {
  x: Math.round(x * 10000) / 10000,
  y: Math.round(y * 10000) / 10000
};
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
