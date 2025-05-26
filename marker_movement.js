
// ==============================
// marker_movement.js
// Steuerung für Markerbewegung in Echtzeit
// Unterstützt: Taktisch (animiert), Operativ (animiert), Transition (springend)
// ==============================

// Hilfsfunktion: Berechne SVG-Mittelpunkt eines Hexfeldes aus seiner ID (F-XXXX)
function berechneXY(hexId) {
  const match = hexId.match(/F-(\d{2})(\d{2})/);
  if (!match) return null;

  const spalte = parseInt(match[1], 10); // 01–27
  const zeile  = parseInt(match[2], 10); // 01–44

  const hexBreite = 103.92; // Pixel-Abstand horizontal
  const hexHoehe  = 89.0;   // angenommener Abstand vertikal (aus SVG ableiten)
  const x0 = 51.96;         // Startpunkt F-0101.x
  const y0 = 3869.89;       // Startpunkt F-0101.y

  const x = x0 + (spalte - 1) * hexBreite;
  const y = y0 - (zeile - 1) * hexHoehe; // SVG wächst von unten nach oben

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
