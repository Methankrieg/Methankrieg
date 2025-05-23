
// Vorausgesetzt: SVG ist eingebettet und geladen mit ID 'svgRoot'
const svg = document.getElementById('svgRoot');
const debug = document.getElementById('debugDisplay');
const kontextLayer = document.getElementById('Kontextmenu_14');

// Hilfsfunktion zum Leeren von Kontextmenüs
function clearContextMenu() {
  kontextLayer.innerHTML = '';
  debug.textContent = '[Kontextmenü entfernt]';
}

// Kontextmenü generieren
function showContextMenu(evt, hexId, type) {
  clearContextMenu();

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
    rect.setAttribute('fill', '#eee');
    rect.setAttribute('stroke', '#444');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', evt.offsetX + 5);
    text.setAttribute('y', y + 13);
    text.setAttribute('font-size', '12');
    text.textContent = label;

    // Event-Handler für Menüpunkt-Klick
    rect.addEventListener('click', () => {
      clearContextMenu();
      if (label === 'Bewegen') {
        const elem = document.getElementById(hexId);
        if (elem) {
          elem.setAttribute('data-move-ready', 'true');
          debug.textContent = `[BEWEGUNG VORGEMERKT] Marker ${hexId} für Bewegung vorbereitet (Phase 2/5 erforderlich)`;
        }
      } else if (label === 'Angreifen') {
        debug.textContent = `[AKTION] Angriff auf Ziel auswählen von ${hexId}`;
      } else if (label === 'Flottengruppen bilden') {
        debug.textContent = `[AKTION] Flottenmanager für ${hexId} öffnen...`;
      } else if (label === 'Löschen') {
        const elem = document.getElementById(hexId);
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

// Auswahl hervorheben
function highlightElement(elem) {
  document.querySelectorAll('.highlight').forEach(e => e.classList.remove('highlight'));
  elem.classList.add('highlight');
  debug.textContent = `[AUSWAHL] ${elem.id || elem.getAttribute('data-hex') || '[unbekannt]'} ausgewählt.`;
}

// Event Delegation für Marker & Industriesysteme
['Marker_13', 'Industriesysteme_11'].forEach(layerId => {
  const layer = document.getElementById(layerId);
  if (!layer) return;

  layer.querySelectorAll('*').forEach(elem => {
    const type = layerId === 'Marker_13' ? 'marker' : 'industrie';
    const hexId = elem.id || elem.getAttribute('data-hex') || '[unbekannt]';

    // Linksklick: Auswahl
    elem.addEventListener('click', evt => {
      evt.stopPropagation();
      highlightElement(elem);
    });

    // Rechtsklick: Kontextmenü
    elem.addEventListener('contextmenu', evt => {
      evt.preventDefault();
      evt.stopPropagation();
      showContextMenu(evt, hexId, type);
    });
  });
});

// Globales Klicken schließt Kontextmenü
svg.addEventListener('click', () => clearContextMenu());
