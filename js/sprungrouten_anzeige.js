// sprungrouten_anzeige.js – Zeigt alle Sprungrouten-Linien im Layer "Sprungrouten_05"

function zeichneSprungrouten(svg, routenArray) {
  const layer = document.getElementById("Sprungrouten_05");
  if (!layer) {
    console.warn("[Sprungrouten] Layer 'Sprungrouten_05' nicht gefunden.");
    return;
  }

  // Bestehende Einträge entfernen
  while (layer.firstChild) layer.removeChild(layer.firstChild);

  routenArray.forEach((route, index) => {
    for (let i = 0; i < route.length - 1; i++) {
      const feldA = route[i];
      const feldB = route[i + 1];
      const elA = document.getElementById(feldA);
      const elB = document.getElementById(feldB);

      if (!elA || !elB) continue;

      const bboxA = elA.getBBox();
      const bboxB = elB.getBBox();

      const x1 = bboxA.x + bboxA.width / 2;
      const y1 = bboxA.y + bboxA.height / 2;
      const x2 = bboxB.x + bboxB.width / 2;
      const y2 = bboxB.y + bboxB.height / 2;

      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", x1);
      line.setAttribute("y1", y1);
      line.setAttribute("x2", x2);
      line.setAttribute("y2", y2);
      line.setAttribute("stroke", "#003366"); // dunkelblau
      line.setAttribute("stroke-width", "4");
      line.setAttribute("opacity", "0.8");

      layer.appendChild(line);
    }
  });

  console.log("[Sprungrouten] Linien aktualisiert im Layer 'Sprungrouten_05'");
}
