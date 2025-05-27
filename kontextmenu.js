// ===========================================
// kontextmenu_v5_komplett.js – Komplettversion
// ===========================================

// Initialisierung des Kontextmenüs (SVG wird extern geladen)
function initialisiereKontextmenu(svg) {
  const debug = document.getElementById("log");
  const kontextLayer = svg.getElementById("Kontextmenu_14");

  if (!svg || !kontextLayer || !debug) {
    console.error("[FEHLER] SVG oder Ziel-Elemente nicht gefunden.");
    return;
  }

  ['Marker_13', 'Industriesysteme_11', 'Hex_grid_02'].forEach(layerId => {
    const layer = svg.getElementById(layerId);
    if (!layer) return;

    layer.querySelectorAll('*').forEach(elem => {
      const type = layerId === 'Hex_grid_02' ? 'hex' :
                   layerId === 'Marker_13' ? 'marker' : 'industrie';
      const hexId = elem.id || elem.getAttribute('data-hex') || '[unbekannt]';

      elem.addEventListener("click", evt => {
        evt.stopPropagation();
        selectElement(elem);
      });

      elem.addEventListener("contextmenu", evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, hexId, type);
      });

      elem.addEventListener("mouseenter", () => {
        elem.classList.add("cursor-pointer");
      });

      elem.addEventListener("mouseleave", () => {
        elem.classList.remove("cursor-pointer");
      });
    });
  });

  svg.addEventListener('click', () => clearContextMenu());
}

// ===============================
// Hilfsfunktionen
// ===============================

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
  const eintraege = [];

  if (!window.gameState || !Array.isArray(gameState.startaufstellung)) {
    console.warn("⚠️ Kein gültiger gameState oder startaufstellung nicht vorhanden.");
    return [];
  }

  gameState.startaufstellung.forEach(einheit => {
    if (!einheit.einheit || !einheit.feld) return;
    const dist = hexDistanz(einheit.feld, zielHex);
    if (dist <= 10) {
      eintraege.push({
        name: einheit.einheit,
        feld: einheit.feld,
        markerId: "marker-" + einheit.feld,
        distanz: dist
      });
    }
  });
  return eintraege;
}

function clearContextMenu() {
  const kontextLayer = document.getElementById("Kontextmenu_14");
  if (kontextLayer) kontextLayer.innerHTML = '';
  const debug = document.getElementById("log");
  if (debug) debug.textContent = '[Kontextmenü entfernt]';
}

function selectElement(elem) {
  const debug = document.getElementById("log");
  const previous = document.querySelector('.selected');
  if (previous) previous.classList.remove('selected');
  elem.classList.add('selected');
  debug.textContent = `[AUSGEWÄHLT] ${elem.id || elem.getAttribute("data-hex")}`;
}

function showDetailPanel(hexId) {
  let panel = document.getElementById("detailpanel-container");
  let frame = document.getElementById("detailpanel-frame");
  if (panel && frame) {
    frame.src = "detailpanel.html?hex=" + encodeURIComponent(hexId);
    panel.style.display = "block";
  }
}

function showContextMenu(evt, hexId, type) {
  clearContextMenu();
  const kontextLayer = document.getElementById("Kontextmenu_14");
  kontextLayer.style.pointerEvents = "auto";

  const baseOptions = {
    'hex': ['Bewege nach hier', 'Eröffne Gefecht', 'Details'],
    'industrie': ['Werften', 'Sensorik', 'Details', 'Bewegen zu'],
    'marker': ['Gruppieren', 'Jäger aufnehmen', 'Admiral aufnehmen', 'Admiral absetzen', 'Details']
  };

  const options = baseOptions[type];
  const svg = document.querySelector("svg");

  const menu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  menu.setAttribute('id', 'contextMenu');

  const point = svg.createSVGPoint();
  point.x = evt.clientX;
  point.y = evt.clientY;
  const ctm = svg.getScreenCTM().inverse();
  const svgP = point.matrixTransform(ctm);

  const menuX = svgP.x - 50;
  const menuY = svgP.y;

  options.forEach((label, index) => {
    const y = menuY + index * 20;
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', menuX);
    rect.setAttribute('y', y);
    rect.setAttribute('width', '140');
    rect.setAttribute('height', '18');
    rect.setAttribute('fill', '#fff');
    rect.setAttribute('stroke', '#333');
    rect.setAttribute('pointer-events', 'all');
    rect.setAttribute('style', 'cursor: pointer;');
    rect.addEventListener('mouseenter', () => rect.setAttribute('fill', '#ccc'));
    rect.addEventListener('mouseleave', () => rect.setAttribute('fill', '#fff'));

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', menuX + 5);
    text.setAttribute('y', y + 13);
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#000');
    text.setAttribute('pointer-events', 'none');
    text.textContent = label;

    rect.addEventListener('click', (evt) => {
      evt.stopPropagation();
      if (label === 'Details') {
        showDetailPanel(hexId);
        clearContextMenu();
      } else if (label === 'Bewege nach hier') {
        const eintraege = getNaheMarker(hexId);
        if (eintraege.length > 0) {
          createSubmenu(menu, menuX, menuY + (index + 1) * 20, eintraege, hexId);
        } else {
          const debug = document.getElementById("log");
          debug.textContent = '[INFO] Kein Marker in Reichweite für Bewegung.';
          clearContextMenu();
        }
      } else {
        const debug = document.getElementById("log");
        debug.textContent = `[AKTION] ${label} für ${hexId}`;
        clearContextMenu();
      }
    });

    menu.appendChild(rect);
    menu.appendChild(text);
  });

  kontextLayer.appendChild(menu);
}
