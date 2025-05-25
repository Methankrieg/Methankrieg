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

      const submenuItems = {
        'Bewege nach hier': ['14. Linieng.', 'Imperatorengarde', 'Trompon'],
        'Werften': ['39', '39', '28', '15'],
        'Bewegen zu': ['Trompon', '10. Linieng.']
      };




      
      function showDetailPanel(hexId) {
        let panel = document.getElementById("detailpanel-container");
        let frame = document.getElementById("detailpanel-frame");
        if (panel && frame) {
          frame.src = "detailpanel.html?hex=" + encodeURIComponent(hexId);
          panel.style.display = "block";
        }
      }

      function createSubmenu(menu, baseX, baseY, options) {
        options.forEach((item, i) => {
          const y = baseY + i * 20;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', baseX + 140);
          rect.setAttribute('y', y);
          rect.setAttribute('width', '140');
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
          text.textContent = item;

          rect.addEventListener('click', (evt) => {
            evt.stopPropagation();
            document.getElementById("Kontextmenu_14").innerHTML = '';
            document.getElementById("log").textContent = `[SUB-AKTION] ${item}`;
          });

          menu.appendChild(rect);
          menu.appendChild(text);
        });
      }
function selectElement(elem) {
        if (selectedElement) selectedElement.classList.remove('selected');
        selectedElement = elem;
        elem.classList.add('selected');
        debug.textContent = `[AUSGEWÄHLT] ${elem.id || elem.getAttribute("data-hex")}`;
      }

      function clearContextMenu() {
        kontextLayer.innerHTML = '';
        debug.textContent = '[Kontextmenü entfernt]';
      }

      function showContextMenu(evt, hexId, type) {
        clearContextMenu();
        kontextLayer.style.pointerEvents = "auto";

        const options = baseOptions[type];

        
        const menu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        menu.setAttribute('id', 'contextMenu');

        // Bildschirmkoordinaten -> SVG-Koordinaten
        const point = svg.createSVGPoint();
        point.x = evt.clientX;
        point.y = evt.clientY;
        const ctm = svg.getScreenCTM().inverse();
        const svgP = point.matrixTransform(ctm);

        // Menüposition berechnen: 50px links vom Klick
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
          rect.addEventListener('mouseenter', () => {
            rect.setAttribute('fill', '#ccc');
          });
          rect.addEventListener('mouseleave', () => {
            rect.setAttribute('fill', '#fff');
          });

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
    } else if (submenuItems[label]) {
      createSubmenu(menu, menuX, y, submenuItems[label]);
    } else {
      clearContextMenu();
      const elem = svg.getElementById(hexId);
      debug.textContent = `[AKTION] ${label} für ${hexId}`;
    }
  });

          menu.appendChild(rect);
          menu.appendChild(text);
        });

        kontextLayer.appendChild(menu);
        debug.textContent = `[KONTEXTMENÜ] für ${type} ${hexId} angezeigt.`;
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
    });
});
