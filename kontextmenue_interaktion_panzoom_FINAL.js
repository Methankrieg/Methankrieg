
function initKontext(svg) {

  const debug = document.getElementById("debugDisplay");

  // Panzoom aktivieren
  const panzoomInstance = panzoom(svg, {
    contain: 'outside',
    maxZoom: 5,
    minZoom: 0.5,
    zoomSpeed: 0.065
  });

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
        if (label === 'Bewegen') {
          if (elem) {
            elem.setAttribute('data-move-ready', 'true');
            debug.textContent = `[BEWEGUNG VORGEMERKT] Marker ${hexId} für Bewegung vorbereitet.`;
          }
        } else if (label === 'Angreifen') {
          debug.textContent = `[AKTION] Angriff auf Ziel auswählen von ${hexId}`;
        } else if (label === 'Flottengruppen bilden') {
          debug.textContent = `[AKTION] Flottenmanager für ${hexId} öffnen...`;
        } else if (label === 'Löschen') {
          if (elem) elem.remove();
          debug.textContent = `[MARKER GELÖSCHT] ${hexId} wurde entfernt.`;
        } else {
          debug.textContent = `[DETAILS] Zeige Informationen zu ${hexId}`;
        }
      });

      menu.appendChild(rect);
      menu.appendChild(text);
    });

    kontextLayer.appendChild(menu);
    debug.textContent = `[KONTEXTMENÜ] für ${type} ${hexId} angezeigt.`;
  }

  function highlightElement(elem) {
    svg.querySelectorAll('.highlight').forEach(e => e.classList.remove('highlight'));
    elem.classList.add('highlight');
    debug.textContent = `[AUSWAHL] ${elem.id || elem.getAttribute('data-hex') || '[unbekannt]'} ausgewählt.`;
  }

  ['Marker_13', 'Industriesysteme_11', 'Hex_grid_02'].forEach(layerId => {
    const layer = svg.getElementById(layerId);
    if (!layer) return;

    layer.querySelectorAll('*').forEach(elem => {
      const type =
      layerId === 'Hex_grid_02' ? 'hex' : layerId === 'Marker_13' ? 'marker' : 'industrie';
      const hexId = elem.id || elem.getAttribute('data-hex') || '[unbekannt]';

      elem.addEventListener('click', evt => {
        evt.stopPropagation();
        highlightElement(elem);
      });

      elem.addEventListener('contextmenu', evt => {
        evt.preventDefault();
        evt.stopPropagation();
        showContextMenu(evt, hexId, type);
      });
    });
  });

  svg.addEventListener('click', () => clearContextMenu());
});
