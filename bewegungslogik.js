// ==========================================
// bewegungslogik.js – Bewegungsregeln für Methankrieg (Mai 2025)
// ==========================================

// Diese Datei enthält Funktionen zur Prüfung von Bewegungsmöglichkeiten
// für taktische, transitionale und operative Bewegungen.

// 🧮 Hilfsfunktion: Berechne Distanz im Hex-Raster (F-Format)
function hexDistanz(a, b) {
  const getRC = hex => {
    const m = hex.match(/F-(\d{2})(\d{2})/);
    return m ? { r: parseInt(m[2], 10), c: parseInt(m[1], 10) } : null;
  };
  const A = getRC(a);
  const B = getRC(b);
  if (!A || !B) return 99;
  const dx = B.c - A.c;
  const dy = B.r - A.r;
  const dz = -(dx + dy);
  return Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
}

// 📦 Taktische Bewegung
function isTaktischMoeglich(start, ziel, feindlicheFelder, dunkelwolkenFelder) {
  const dist = hexDistanz(start, ziel);
  if (dist < 1 || dist > 3) return false;
  if (dunkelwolkenFelder.includes(ziel)) return false;
  return true;
}

// 📦 Transitionale Bewegung
function isTransitionMoeglich(start, ziel) {
  const dist = hexDistanz(start, ziel);
  return dist >= 1 && dist <= 10;
}

// 📦 Operative Bewegung entlang Sprungrouten
function isOperativMoeglich(start, ziel, sprungrouten, feindlicheFelder) {
  // Pfadsuche entlang von Sprungrouten von start nach ziel
  // Dabei dürfen keine Felder im Pfad feindlich besetzt sein

  const visited = new Set();
  const queue = [[start]];

  while (queue.length > 0) {
    const pfad = queue.shift();
    const current = pfad[pfad.length - 1];
    if (current === ziel) {
      // Prüfe ob alle Felder im Pfad frei sind
      for (let hex of pfad) {
        if (feindlicheFelder.includes(hex)) return false;
      }
      return true;
    }
    visited.add(current);

    const angrenzende = sprungrouten
      .filter(([a, b]) => a === current || b === current)
      .map(([a, b]) => (a === current ? b : a));

    angrenzende.forEach(nachbar => {
      if (!visited.has(nachbar)) {
        queue.push([...pfad, nachbar]);
      }
    });
  }

  return false;
}

// Exportiere Funktionen global
window.Bewegungslogik = {
  hexDistanz,
  isTaktischMoeglich,
  isTransitionMoeglich,
  isOperativMoeglich
};
