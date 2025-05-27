// ===========================================
// sprungrouten_anzeige.js – Zeichnet Sprungrouten ins SVG
// ===========================================

function zeichneSprungrouten(svg, sprungroutenArray) {
  if (!svg || !Array.isArray(sprungroutenArray)) return;

  const layerId = "SprungroutenLayer";
  let layer = svg.getElementById(layerId);

  // Falls Layer nicht existiert, neu anlegen
  if (!layer) {
    layer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    layer.setAttribute("id", layerId);
    svg.appendChild(layer);
  }

  // Alle Routen zeichnen
  sprungroutenArray.forEach(route => {
    if (!Array.isArray(route) || route.length < 2) return;

    for (let i = 0; i < route.length - 1; i++) {
      const startId = route[i];
      const zielId = route[i + 1];

      const startHex = svg.getElementById(startId);
      const zielHex  = svg.getElementById(zielId);
      if (!startHex || !zielHex) {
        console.warn(`[WARNUNG] Sprungrouten-Hex nicht gefunden: ${startId} oder ${zielId}`);
        return;
      }

      const startBox = startHex.getBBox();
      const zielBox = zielHex.getBBox();

      const x1 = startBox.x + startBox.width / 2;
      const y1 = startBox.y + startBox.height / 2;
      const x2 = zielBox.x + zielBox.width / 2;
      const y2 = zielBox.y + zielBox.height / 2;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "cyan");
      line.setAttribute("stroke-width", 4);
      line.setAttribute("stroke-linecap", "round");

      layer.appendChild(line);
    }
  });

  console.log(`[INIT] ${sprungroutenArray.length} Sprungroutenverbindungen gezeichnet.`);
}
