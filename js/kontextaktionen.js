// ===========================================
// kontextaktionen.js – Submenü-Aktionen (z. B. Bewegung)
// ===========================================

function createSubmenu(menu, baseX, baseY, eintraege, zielHex) {
  const dunkelwolkenFelder = window.dunkelwolkenFelder || new Set();
  const sprungrouten = window.sprungroutenDaten || [];
  const belegteFelder = new Set(
    (window.gameState?.startaufstellung || [])
      .filter(e => e.feld !== zielHex)
      .map(e => e.feld)
  );

  // Container für Submenü-Hintergrund mit Scrollbereich
  const submenuGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  submenuGroup.setAttribute('id', 'submenu-scroll-container');
  menu.appendChild(submenuGroup);

  const maxVisibleEntries = 15;
  const entryHeight = 22;
  const menuWidth = 240;

  const visibleEntries = eintraege.length > maxVisibleEntries ? maxVisibleEntries : eintraege.length;
  const totalHeight = eintraege.length * entryHeight;
  const visibleHeight = visibleEntries * entryHeight;

  const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  backgroundRect.setAttribute('x', baseX + 130);
  backgroundRect.setAttribute('y', baseY);
  backgroundRect.setAttribute('width', menuWidth);
  backgroundRect.setAttribute('height', visibleHeight);
  backgroundRect.setAttribute('fill', '#f8f8f8');
  backgroundRect.setAttribute('stroke', '#888');
  submenuGroup.appendChild(backgroundRect);

  let scrollOffset = 0;

  function renderSubmenu() {
    // Clear previous entries
    while (submenuGroup.children.length > 1) {
      submenuGroup.removeChild(submenuGroup.lastChild);
    }

    eintraege.forEach((item, i) => {
      const einheit = gameState.startaufstellung.find(e => e.einheit === item.name);
      if (!einheit || einheit.bereitsBewegt) return;

      const y = baseY + (i - scrollOffset) * entryHeight;
      if (y < baseY || y > baseY + visibleHeight - entryHeight) return;

      const markerId = `marker-${item.feld}-${item.name}`;
      let offset = 0;

      const bewegungstypen = [];

      if (Bewegungslogik.isTaktischMoeglich(einheit.feld, zielHex, belegteFelder, dunkelwolkenFelder)) {
        bewegungstypen.push({
          typ: 'taktisch',
          farbe: '#cfc',
        });
      }

      if (Bewegungslogik.isTransitionMoeglich(einheit.feld, zielHex)) {
        bewegungstypen.push({
          typ: 'transition',
          farbe: '#ccf',
        });
      }

      if (Bewegungslogik.isOperativMoeglich(einheit.feld, zielHex, sprungrouten, belegteFelder)) {
        bewegungstypen.push({
          typ: 'operativ',
          farbe: '#ffc',
        });
      }

      if (StrategischeRoutenlogik.istMoeglich(einheit.feld, zielHex, belegteFelder)) {
        bewegungstypen.push({
          typ: 'strategie',
          farbe: '#fbd',
        });
      }

      bewegungstypen.forEach((bewegung, idx) => {
        const ty = y + offset * 20;

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', baseX + 135);
        rect.setAttribute('y', ty);
        rect.setAttribute('width', menuWidth - 10);
        rect.setAttribute('height', '18');
        rect.setAttribute('fill', bewegung.farbe);
        rect.setAttribute('stroke', '#444');
        rect.setAttribute('cursor', 'pointer');

        rect.addEventListener('click', () => {
          bewegeMarker(markerId, einheit.feld, zielHex, bewegung.typ);
          einheit.bereitsBewegt = true;
          einheit.bewegungsArt = bewegung.typ;
          einheit.feld = zielHex;
          clearContextMenu();
        });

        // Tooltip als Title-Element (SVG-nativ)
        rect.setAttribute('title',
          `${einheit.einheit}\n` +
          `Typ: ${bewegung.typ}\n` +
          `Angriff: ${einheit.angriff}\n` +
          `Verteidigung: ${einheit.verteidigung}\n` +
          `HP: ${einheit.hp}\n` +
          `Status: ${einheit.status || 'regulär'}`
        );

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', baseX + 140);
        text.setAttribute('y', ty + 13);
        text.setAttribute('font-size', '12');
        text.setAttribute('fill', '#000');
        text.setAttribute('pointer-events', 'none');
        text.textContent = `${item.name} [${bewegung.typ}]`;

        submenuGroup.appendChild(rect);
        submenuGroup.appendChild(text);

        offset++;
      });
    });

    // Scroll-Hinweise
    if (eintraege.length > maxVisibleEntries) {
      const scrollUp = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      scrollUp.setAttribute('x', baseX + 220);
      scrollUp.setAttribute('y', baseY - 5);
      scrollUp.setAttribute('font-size', '16');
      scrollUp.setAttribute('fill', scrollOffset > 0 ? 'black' : '#ccc');
      scrollUp.setAttribute('cursor', 'pointer');
      scrollUp.textContent = '▲';
      scrollUp.addEventListener('click', () => {
        if (scrollOffset > 0) {
          scrollOffset--;
          renderSubmenu();
        }
      });

      const scrollDown = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      scrollDown.setAttribute('x', baseX + 220);
      scrollDown.setAttribute('y', baseY + visibleHeight + 16);
      scrollDown.setAttribute('font-size', '16');
      scrollDown.setAttribute('fill', scrollOffset < eintraege.length - maxVisibleEntries ? 'black' : '#ccc');
      scrollDown.setAttribute('cursor', 'pointer');
      scrollDown.textContent = '▼';
      scrollDown.addEventListener('click', () => {
        if (scrollOffset < eintraege.length - maxVisibleEntries) {
          scrollOffset++;
          renderSubmenu();
        }
      });

      menu.appendChild(scrollUp);
      menu.appendChild(scrollDown);
    }
  }

  renderSubmenu();
}
