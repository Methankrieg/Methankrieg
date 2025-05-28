// =============================================
// bewegungslogik.js – Validiert Bewegungsmöglichkeiten auf Hexkarte
// =============================================

function hexDistanz(a, b) {
  if (!a || !b) return 99;

  const A = hexZuCube(a);
  const B = hexZuCube(b);

  if (!A || !B) {
    console.warn(`[WARNUNG] Ungültige Koordinaten: ${a}, ${b}`);
    return 99;
  }

  return Math.max(Math.abs(A.x - B.x), Math.abs(A.y - B.y), Math.abs(A.z - B.z));
}

function hexZuCube(feld) {
  const match = feld.match(/F-(\d{2})(\d{2})/);
  if (!match) return null;

  const q = parseInt(match[1], 10);
  const r = parseInt(match[2], 10) - Math.floor(q % 2 === 0 ? 1 : 0) / 2;
  const x = q - 1;
  const z = r - 1;
  const y = -x - z;
  return { x, y, z };
}

function isTaktischMoeglich(start, ziel, dunkelwolkenFelder) {
  if (start === ziel) return false;
  if (hexDistanz(start, ziel) > 3) return false;
  if (dunkelwolkenFelder.has(ziel)) return false; // ✅ Set-Nutzung
  return true;
}

function isTransitionMoeglich(start, ziel) {
  return hexDistanz(start, ziel) <= 10;
}

function isOperativMoeglich(start, ziel, sprungrouten, feindlicheFelder) {
  const besuchteFelder = new Set();
  const queue = [start];
  besuchteFelder.add(start);

  while (queue.length > 0) {
    const aktuelles = queue.shift();
    if (aktuelles === ziel) return true;

    const nachbarn = sprungrouten
      .filter(route => route.von === aktuelles)
      .map(route => route.nach)
      .filter(nachbar => !besuchteFelder.has(nachbar) && !feindlicheFelder.has(nachbar)); // ✅ Set-Nutzung

    nachbarn.forEach(nachbar => {
      besuchteFelder.add(nachbar);
      queue.push(nachbar);
    });
  }

  return false;
}

// 🔁 Globale Bereitstellung
window.Bewegungslogik = {
  hexDistanz,
  isTaktischMoeglich,
  isTransitionMoeglich,
  isOperativMoeglich
};
