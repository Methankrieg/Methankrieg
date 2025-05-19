/**
 * Zielwertungsmodul für "Der Methankrieg"
 * Bewertet die Spielsituation am Szenarioende
 * Szenariospezifisch anpassbar (z. B. Umkämpftes Casyat)
 */

// Szenarienabhängige Zieldefinitionen
const zieldefinitionen = {
    "umkaempftes_casyat": {
        systeme_halten: { system: "Casyat", vonRunde: 200, bisRunde: 272 },
        gegner_veteranen: { fraktion: "maahks", anzahl: 4 },
        admiral_ausschalten: { name: "Korresh", bisRunde: 230 },
        trantor_schuetzen: { system: "Trantor" }
    }
};

// Hauptfunktion zur Bewertung eines Szenarios
function evaluiereSzenarioZiele(state, szenarioID) {
    const ziele = zieldefinitionen[szenarioID];
    let ergebnis = {
        erfüllt: [],
        nichtErfüllt: []
    };

    if (!ziele) {
        console.warn("Keine Zieldefinition für Szenario:", szenarioID);
        return ergebnis;
    }

    // Beispielprüfung: System gehalten
    if (pruefeSystemHaltung(state, ziele.systeme_halten)) {
        ergebnis.erfüllt.push("Systemkontrolle: " + ziele.systeme_halten.system);
    } else {
        ergebnis.nichtErfüllt.push("Systemkontrolle: " + ziele.systeme_halten.system);
    }

    // Weitere Prüfungen ...
    // (Veteranen, Admiräle, Zugang zu Systemen etc.)

    return ergebnis;
}

// Prüfe, ob ein System in allen geforderten Runden gehalten wurde
function pruefeSystemHaltung(state, ziel) {
    let kontrolliert = true;
    for (let r = ziel.vonRunde; r <= ziel.bisRunde; r++) {
        if (!state.systemkontrolle[r] || state.systemkontrolle[r][ziel.system] !== "arkoniden") {
            kontrolliert = false;
        }
    }
    return kontrolliert;
}

// Gibt Punktestand zurück (z. B. für Vergleich bei Gleichstand)
function berechnePunktestand(fraktion, state) {
    // Platzhalter: spätere Berechnung aus Produktionsmacht, Restflotte, Zielerfüllung etc.
    return 100;
}

// Ermittelt Siegklasse (z. B. strategisch, operativ, unentschieden, Niederlage)
function ermitteleSiegart(fraktion, state, szenarioID) {
    const bewertung = evaluiereSzenarioZiele(state, szenarioID);
    const anzahlErfüllt = bewertung.erfüllt.length;

    if (anzahlErfüllt >= 3) return "Strategischer Sieg";
    if (anzahlErfüllt === 2) return "Operativer Sieg";
    if (anzahlErfüllt === 1) return "Unentschieden";
    return "Niederlage";
}