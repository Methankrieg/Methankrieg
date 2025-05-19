
document.addEventListener("DOMContentLoaded", () => {
  if (typeof gameState !== "undefined") {
    const einheiten = gameState.einheiten || [];
    const admirale = gameState.admirale || [];

    // Einheiten-Marker einfügen
    const einheitenLayer = document.getElementById("Einheiten_Marker");
    einheiten.forEach(({ einheit, position }) => {
      const zielFeld = document.getElementById(position);
      if (zielFeld && einheitenLayer) {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        marker.setAttribute("r", "10");
        marker.setAttribute("fill", "#00ff00");
        marker.setAttribute("cx", zielFeld.getAttribute("cx"));
        marker.setAttribute("cy", zielFeld.getAttribute("cy"));
        marker.setAttribute("stroke", "#000");
        marker.setAttribute("stroke-width", "2");
        marker.setAttribute("data-label", einheit);
        einheitenLayer.appendChild(marker);
      }
    });

    // Admirale-Marker einfügen
    const admLayer = document.getElementById("Admirale_Marker");
    admirale.forEach(({ einheit, position }) => {
      const zielFeld = document.getElementById(position);
      if (zielFeld && admLayer) {
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        marker.setAttribute("width", "18");
        marker.setAttribute("height", "18");
        marker.setAttribute("fill", "#ffcc00");
        marker.setAttribute("x", zielFeld.getAttribute("cx") - 9);
        marker.setAttribute("y", zielFeld.getAttribute("cy") - 9);
        marker.setAttribute("stroke", "#000");
        marker.setAttribute("stroke-width", "2");
        marker.setAttribute("data-label", einheit);
        admLayer.appendChild(marker);
      }
    });
  } else {
    console.warn("gameState nicht definiert.");
  }
});
