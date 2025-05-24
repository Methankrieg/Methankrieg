
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("svgwrapper");
  const debug = document.getElementById("log");

  fetch("Sektor_TEMPLATE_MIT_INDUSTRIESYSTEM_4111_FINAL.svg")
    .then(response => response.text())
    .then(data => {
      wrapper.innerHTML = data;
      const svg = wrapper.querySelector("svg");
      const kontextLayer = svg.getElementById("Kontextmenu_14");

      const panzoomInstance = Panzoom(svg, {
        contain: 'outside',
        maxScale: 5,
        minScale: 0.5,
        zoomSpeed: 0.065
      });
      wrapper.addEventListener('wheel', panzoomInstance.zoomWithWheel);

      function clearContextMenu() {
        kontextLayer.innerHTML = '';
        debug.textContent = '[Kontextmenü entfernt]';
      }

      function showContextMenu(evt, hexId, type) {
        clearContextMenu();
        kontextLayer.style.pointerEvents = "auto";
        const menu = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        menu.setAttribute('id', 'contextMenu');

        const options = type === 'marker'
          ? ['Bewegen', 'Angreifen', 'Flottengruppen bilden', 'Löschen', 'Details anzeigen']
          : ['Werften', 'Produktion', 'Details anzeigen'];

        options.forEach((label, index) => {
          const y = evt.offsetY + index * 20;
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', evt.offsetX);
          rect.setAttribute('y', y);
          rect.setAttribute('width', '140');
          rect.setAttribute('height', '18');
          rect.setAttribute('fill', '#fff');
          rect.setAttribute('stroke', '#333');

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', evt.offsetX + 5);
          text.setAttribute('y', y + 13);
          text.setAttribute('font-size', '12');
          text.setAttribute('fill', '#000');
          text.textContent = label;

          rect.addEventListener('click', () => {
            clearContextMenu();
            const elem = svg.getElementById(hexId);
            debug.textContent = `[AKTION] ${label} für ${hexId}`;
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

          elem.addEventListener('click', evt => {
            evt.stopPropagation();
            debug.textContent = `[AUSWAHL] ${hexId}`;
          });

          elem.addEventListener('contextmenu', evt => {
            evt.preventDefault();
            evt.stopPropagation();
            showContextMenu(evt, hexId, type);
          });
        });
      });

      svg.addEventListener('click', () => clearContextMenu());
    })
    .catch(err => {
      debug.textContent = `[FEHLER] SVG konnte nicht geladen werden: ${err}`;
    });
});
