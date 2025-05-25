
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("svgwrapper");
  const debug = document.getElementById("log");
  const detailPanel = document.getElementById("detailpanel-container");
  const detailFrame = document.getElementById("detailpanel-frame");

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

      function clearContextMenu() {
        kontextLayer.innerHTML = '';
        kontextLayer.style.pointerEvents = "none";
        debug.textContent = '[Kontextmenü entfernt]';
      }

      function showDetailPanel(url) {
        detailFrame.src = url;
        detailPanel.style.display = "block";
      }

      function hideDetailPanel() {
        detailPanel.style.display = "none";
        detailFrame.src = "";
      }

      function createSubmenu(menu, x, y, items) {
        items.forEach((label, index) => {
          const subY = y + index * 20;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x + 140);
          rect.setAttribute('y', subY);
          rect.setAttribute('width', '140');
          rect.setAttribute('height', '18');
          rect.setAttribute('fill', '#eee');
          rect.setAttribute('stroke', '#999');
          rect.setAttribute('pointer-events', 'all');

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', x + 145);
          text.setAttribute('y', subY + 13);
          text.setAttribute('font-size', '12');
          text.setAttribute('fill', '#000');
          text.textContent = label;

          rect.addEventListener('click', (evt) => {
            evt.stopPropagation();
            clearContextMenu();
            debug.textContent = `[SUB-AKTION] ${label}`;
          });

          menu.appendChild(rect);
          menu.appendChild(text);
        });
      }

      function showContextMenu(evt, hexId, type) {
        clearContextMenu();
        kontextLayer.style.pointerEvents = "auto";

        const point = svg.createSVGPoint();
        point.x = evt.clientX;
        point.y = evt.clientY;
        const svgP = point.matrixTransform(svg.getScreenCTM().inverse());
        const menuX = svgP.x - 50;
        const menuY = svgP.y;

        const menu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        menu.setAttribute('id', 'contextMenu');

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

        baseOptions[type].forEach((label, index) => {
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

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', menuX + 5);
          text.setAttribute('y', y + 13);
          text.setAttribute('font-size', '12');
          text.setAttribute('fill', '#000');
          text.textContent = label;

          rect.addEventListener('click', (evt) => {
            evt.stopPropagation();
            if (label === 'Details') {
              showDetailPanel("detailpanel.html");
            } else if (submenuItems[label]) {
              createSubmenu(menu, menuX, y, submenuItems[label]);
            } else {
              clearContextMenu();
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
          const hexId = elem.getAttribute('data-hex') || elem.id || '[unbekannt]';

          elem.addEventListener("click", evt => {
            evt.stopPropagation();
            selectedElement = elem;
            debug.textContent = `[AUSGEWÄHLT] ${hexId}`;
            hideDetailPanel();
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

      svg.addEventListener('click', () => {
        clearContextMenu();
        hideDetailPanel();
      });
    })
    .catch(err => {
      debug.textContent = `[FEHLER] SVG konnte nicht geladen werden: ${err}`;
    });
});
