document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("svgwrapper");
  const debug = document.getElementById("log");

  fetch("SVG_MARKER_F3910_GEOMETRISCH_ZENTRIERT_mit_datahex.svg")
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
            elem.style.cursor = "pointer";
          });

          elem.addEventListener("mouseleave", () => {
            elem.style.cursor = "default";
          });
        });
      });

svg.addEventListener('click', () => clearContextMenu());
    })
    .catch(err => {
      debug.textContent = `[FEHLER] SVG konnte nicht geladen werden: ${err}`;
      console.log('[DEBUG]', `[FEHLER] SVG konnte nicht geladen werden: ${err}`);
    });
});


function createSubmenu(menu, baseX, baseY, eintraege, zielHex) {
  eintraege
    .filter(item => {
      const einheit = gameState.startaufstellung.find(e => e.einheit === item.name);
      return einheit && einheit.bereitsBewegt === false;
    }) // ✳️ Nur noch nicht bewegte anzeigen
    .forEach((item, i) => {
      const y = baseY + i * 20;

      // ✳️ Neue Bewegungsauswahl pro Einheit – bis zu 3 Buttons
      const einheit = gameState.startaufstellung.find(e => e.einheit === item.name);
      if (!einheit) return;

      let buttonOffset = 0; // vertikale Verschiebung pro Button

      // 🔧 Platzhalterlisten – später dynamisch ersetzen
      const feindlicheFelder = []; // z.B. ["F-3911"]
      const dunkelwolkenFelder = []; // z.B. ["F-3922"]
      const sprungrouten = []; // z.B. [["F-3909", "F-4010"], ["F-4010", "F-4111"]]

      // 🔹 1. Taktisch
      if (Bewegungslogik.isTaktischMoeglich(einheit.feld, zielHex, feindlicheFelder, dunkelwolkenFelder)) {
        const yOffset = y + buttonOffset * 20;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', baseX + 140);
        rect.setAttribute('y', yOffset);
        rect.setAttribute('width', '180');
        rect.setAttribute('height', '18');
        rect.setAttribute('fill', '#eee');
        rect.setAttribute('stroke', '#666');
        rect.setAttribute('pointer-events', 'all');
        rect.setAttribute('style', 'cursor: pointer;');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', baseX + 145);
        text.setAttribute('y', yOffset + 13);
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#000');
        text.setAttribute('pointer-events', 'none');
        text.textContent = `${item.name} (${item.distanz}) [taktisch]`;

        rect.addEventListener('click', () => {
          bewegeMarker("marker-" + item.feld, einheit.feld, zielHex, "taktisch");
          einheit.bereitsBewegt = true;
          einheit.bewegungsArt = "taktisch";
          clearContextMenu();
        });

        menu.appendChild(rect);
        menu.appendChild(text);
        buttonOffset++;
      }

      // 🔹 2. Transition
      if (Bewegungslogik.isTransitionMoeglich(einheit.feld, zielHex)) {
        const yOffset = y + buttonOffset * 20;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', baseX + 140);
        rect.setAttribute('y', yOffset);
        rect.setAttribute('width', '180');
        rect.setAttribute('height', '18');
        rect.setAttribute('fill', '#eef');
        rect.setAttribute('stroke', '#666');
        rect.setAttribute('pointer-events', 'all');
        rect.setAttribute('style', 'cursor: pointer;');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', baseX + 145);
        text.setAttribute('y', yOffset + 13);
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#000');
        text.setAttribute('pointer-events', 'none');
        text.textContent = `${item.name} (${item.distanz}) [transition]`;

        rect.addEventListener('click', () => {
          bewegeMarker("marker-" + item.feld, einheit.feld, zielHex, "transition");
          einheit.bereitsBewegt = true;
          einheit.bewegungsArt = "transition";
          clearContextMenu();
        });

        menu.appendChild(rect);
        menu.appendChild(text);
        buttonOffset++;
      }

      // 🔹 3. Operativ
      if (Bewegungslogik.isOperativMoeglich(einheit.feld, zielHex, sprungrouten, feindlicheFelder)) {
        const yOffset = y + buttonOffset * 20;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', baseX + 140);
        rect.setAttribute('y', yOffset);
        rect.setAttribute('width', '180');
        rect.setAttribute('height', '18');
        rect.setAttribute('fill', '#efe');
        rect.setAttribute('stroke', '#666');
        rect.setAttribute('pointer-events', 'all');
        rect.setAttribute('style', 'cursor: pointer;');

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', baseX + 145);
        text.setAttribute('y', yOffset + 13);
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#000');
        text.setAttribute('pointer-events', 'none');
        text.textContent = `${item.name} [operativ]`;

        rect.addEventListener('click', () => {
          bewegeMarker("marker-" + item.feld, einheit.feld, zielHex, "operativ");
          einheit.bereitsBewegt = true;
          einheit.bewegungsArt = "operativ";
          clearContextMenu();
        });

        menu.appendChild(rect);
        menu.appendChild(text);
        buttonOffset++;
      }
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
      console.log('[DEBUG]', '[Kontextmenü entfernt]');
}

function selectElement(elem) {
  const debug = document.getElementById("log");
  const previous = document.querySelector('.selected');
  if (previous) previous.classList.remove('selected');
  elem.classList.add('selected');
  debug.textContent = `[AUSGEWÄHLT] ${elem.id || elem.getAttribute("data-hex")}`;
      console.log('[DEBUG]', `[AUSGEWÄHLT] ${elem.id || elem.getAttribute("data-hex")}`);
}

  function showDetailPanel(hexId) {
    console.log("[DEBUG] showDetailPanel aufgerufen mit:", hexId);
    let panel = document.getElementById("detailpanel-container");
    let frame = document.getElementById("detailpanel-frame");
    if (panel && frame) {
    frame.src = "detailpanel.html?hex=" + encodeURIComponent(hexId);
    panel.style.display = "block";
          }
  }  // Ende showDetailPanel

function showContextMenu(evt, hexId, type) {
  clearContextMenu();
  const kontextLayer = document.getElementById("Kontextmenu_14");
  const debug = document.getElementById("log");
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
            console.log('[DEBUG] Bewege nach hier ausgewählt für Ziel:', hexId);
            const eintraege = getNaheMarker(hexId);
            console.log('[DEBUG] getNaheMarker Ergebnis:', eintraege);
            if (eintraege.length > 0) {
              createSubmenu(menu, menuX, menuY + (index + 1) * 20, eintraege, hexId);
            } else {
              const msg = '[INFO] Kein Marker in Reichweite für Bewegung.';
              debug.textContent = msg;
              console.log('[DEBUG]', msg);
              clearContextMenu();
            }
          } else {
            const msg = `[AKTION] ${label} für ${hexId}`;
            debug.textContent = msg;
            console.log('[DEBUG]', msg);
            clearContextMenu();
          }
        });

    menu.appendChild(rect);
    menu.appendChild(text);
  });

  kontextLayer.appendChild(menu);
  debug.textContent = `[KONTEXTMENÜ] für ${type} ${hexId} angezeigt.`;
      console.log('[DEBUG]', `[KONTEXTMENÜ] für ${type} ${hexId} angezeigt.`);
}
