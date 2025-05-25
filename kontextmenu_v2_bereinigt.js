document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("svgwrapper");
  const debug = document.getElementById("log");

  fetch("SVG_MARKER_F3910_GEOMETRISCH_ZENTRIERT.svg")
    .then(response => response.text())
    .then(data => {
      container.innerHTML = data;

      const svg = container.querySelector("svg");
      const kontextLayer = svg.getElementById("Kontextmenu_14");

      if (!svg || !kontextLayer || !debug) {
        console.error("[FEHLER] SVG oder Ziel-Elemente nicht gefunden.");
        return;
      }

      const panzoomInstance = Panzoom(svg, {
        contain: 'outside',
        maxZoom: 5,
        minZoom: 0.5,
        zoomSpeed: 0.065
      });
      container.addEventListener('wheel', panzoomInstance.zoomWithWheel);

      let selectedElement = null;


      const baseOptions = {
        'hex': ['Bewege nach hier', 'Eröffne Gefecht', 'Details'],
        'industrie': ['Werften', 'Sensorik', 'Details', 'Bewegen zu'],
        'marker': ['Gruppieren', 'Jäger aufnehmen', 'Admiral aufnehmen', 'Admiral absetzen', 'Details']
      };





      
      function showDetailPanel(hexId) {
        let panel = document.getElementById("detailpanel-container");
        let frame = document.getElementById("detailpanel-frame");
        if (panel && frame) {
          frame.src = "detailpanel.html?hex=" + encodeURIComponent(hexId);
          panel.style.display = "block";
          }
      }  // Ende showDetailPanel
    })
    .catch(err => {
      debug.textContent = `[FEHLER] SVG konnte nicht geladen werden: ${err}`;
    });
});



function createSubmenu(menu, baseX, baseY, eintraege, zielHex) {
  eintraege.forEach((item, i) => {
    const y = baseY + i * 20;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', baseX + 140);
    rect.setAttribute('y', y);
    rect.setAttribute('width', '180');
    rect.setAttribute('height', '18');
    rect.setAttribute('fill', '#eee');
    rect.setAttribute('stroke', '#666');
    rect.setAttribute('pointer-events', 'all');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', baseX + 145);
    text.setAttribute('y', y + 13);
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#000');
    text.setAttribute('pointer-events', 'none');
    text.textContent = item.name + " (" + item.distanz + ")";

    rect.addEventListener('click', (evt) => {
      evt.stopPropagation();
      clearContextMenu();
      debug.textContent = `[BEWEGUNG] ${item.name} → ${zielHex}`;
      if (typeof bewegeMarker === "function") {
        bewegeMarker(item.markerId, item.feld, zielHex, "taktisch");
      } else {
        console.warn("bewegeMarker() nicht verfügbar");
      }
    });

    menu.appendChild(rect);
    menu.appendChild(text);
  });
}




// =========================================
// Ergänzung: Hexdistanz + Markerumkreislogik
// =========================================

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


function getNaheMarker(zielHex) {
  console.log(">>> getNaheMarker aufgerufen für Hex:", zielHex);
  const eintraege = [];

  if (!window.gameState || !Array.isArray(gameState.startaufstellung)) {
    console.warn("⚠️ Kein gültiger gameState oder startaufstellung nicht vorhanden.");
    return [];
  }

  gameState.startaufstellung.forEach(einheit => {
    if (!einheit.einheit || !einheit.feld) return;
    const dist = hexDistanz(einheit.feld, zielHex);
    console.log(`→ geprüft: ${einheit.einheit}, feld: ${einheit.feld}, distanz zu ${zielHex}: ${dist}`);
    if (dist <= 3) {
      eintraege.push({
        name: einheit.einheit,
        feld: einheit.feld,
        markerId: "marker-" + einheit.einheit,
        distanz: dist
      });
    }
  });
  return eintraege;
}
