// ==========================================
// kartenloader.js – SVG laden, einfügen, stilisieren
// ==========================================

async function ladeKarte(svgURL = "karten/Karte_Sektor_F_v1.svg", zielElementID = "svgwrapper") {
  try {
    const response = await fetch(svgURL);
    const svgText = await response.text();

    const container = document.getElementById(zielElementID);
    container.innerHTML = svgText;

    const svg = container.querySelector("svg");
    if (!svg) {
      console.error("[FEHLER] Kein <svg> im geladenen Dokument gefunden.");
      return null;
    }

    // ✅ Zoom aktivieren
    const panzoomInstance = Panzoom(svg, {
      contain: 'outside',
      maxZoom: 5,
      minZoom: 0.5,
      zoomSpeed: 0.065
    });
    container.addEventListener('wheel', panzoomInstance.zoomWithWheel);

    // ✅ Sichtbare Stile anwenden
    if (typeof aktualisiereHexfeldStile === 'function') {
      aktualisiereHexfeldStile(svg); // <-- 🛠 Wichtig!
    } else {
      console.warn("[HINWEIS] aktualisiereHexfeldStile() nicht gefunden.");
    }

    console.log(`[KARTE] "${svgURL}" geladen, eingefügt und gestylt.`);
    return svg;

  } catch (err) {
    console.error("[FEHLER] Karte konnte nicht geladen werden:", err);
    return null;
  }
}
