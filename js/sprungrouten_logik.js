// strategische_routenlogik.js – Bewegung entlang freier Sprungrouten (strategisch)

const StrategischeRoutenlogik = (() => {
  // Internes Routennetz als Map: { "Startfeld" => [ {ziel, felder[]} ] }
  const routenNetzwerk = new Map();

  function baueRoutennetzwerk(sprungrouten) {
    sprungrouten.forEach(({ von, nach, route }) => {
      if (!routenNetzwerk.has(von)) routenNetzwerk.set(von, []);
      if (!routenNetzwerk.has(nach)) routenNetzwerk.set(nach, []);

      routenNetzwerk.get(von).push({ ziel: nach, felder: route });
      routenNetzwerk.get(nach).push({ ziel: von, felder: [...route].reverse() });
    });

    console.log("[ROUTEN] Strategisches Netzwerk aufgebaut:", routenNetzwerk);
  }

  function findeRoute(start, ziel, belegteFelderSet = new Set()) {
    if (!routenNetzwerk.has(start) || !routenNetzwerk.has(ziel)) return null;

    const queue = [{ feld: start, pfad: [], besucht: new Set() }];

    while (queue.length > 0) {
      const { feld, pfad, besucht } = queue.shift();
      if (feld === ziel) return pfad;

      const verbindungen = routenNetzwerk.get(feld) || [];

      for (const { ziel: next, felder } of verbindungen) {
        if (besucht.has(next)) continue;

        // Alle Felder der Verbindung müssen frei sein (ausgenommen Start)
        const zwischenfelder = felder.slice(1); // Startfeld darf besetzt sein
        const blockiert = zwischenfelder.some(f => belegteFelderSet.has(f));

        if (!blockiert) {
          queue.push({
            feld: next,
            pfad: [...pfad, ...zwischenfelder],
            besucht: new Set([...besucht, next])
          });
        }
      }
    }

    return null; // Keine Route gefunden
  }

  function istStrategischeBewegungMoeglich(start, ziel, belegteFelderSet) {
    const pfad = findeRoute(start, ziel, belegteFelderSet);
    return pfad !== null;
  }

  return {
    baueRoutennetzwerk,
    findeRoute,
    istMoeglich: istStrategischeBewegungMoeglich
  };
})();
