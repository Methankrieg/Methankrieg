// ===========================================
// kontextaktionen.js – Submenü-Aktionen (z. B. Bewegung)
// ===========================================

function createSubmenu(menu, baseX, baseY, eintraege, zielHex) {
  const dunkelwolkenFelder = window.dunkelwolkenFelder || [];
  const sprungrouten = window.sprungroutenDaten || [];
  const feindlicheFelder = new Set(); // Platzhalter – später mit Inhalt füllen

  eintraege
    .forEach((item, i) => {
      const y = baseY + i * 20;
      const einheit = gameState.startaufstellung.find(e => e.einheit === item.name);
      if (!einheit || einheit.bereitsBewegt) return;

      let buttonOffset = 0;

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
