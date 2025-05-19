/**
 * Gemeinsames Hilfsmodul für KI-Logik in "Der Methankrieg"
 * Beinhaltet standardisierte Regeln, Tests und Bewegungshilfen
 * Wird von ki_maahks.js und ki_arkoniden.js genutzt
 */

// Prüfe Initiative in Reaktionsphase
function pruefeInitiative(gschwader) {
    let basiswert = (gschwader.fraktion === "arkoniden") ? 10 : 7;
    let qualitätsbonus = gschwader.qualitaetBonus || 0;
    let wurf = w20Modifiziert();
    let gesamt = basiswert + qualitätsbonus + wurf;
    console.log(`Initiativeprobe: Basis ${basiswert} + Bonus ${qualitätsbonus} + Wurf ${wurf} = ${gesamt}`);
    return gesamt > 10;
}

// Führe Transition durch (mit Zieltest + Fehllandung)
function fuehreTransition(gschwader, zielFeld) {
    let zieltestErfolg = zieltest(gschwader);
    if (zieltestErfolg) {
        console.log("Transitionszieltest erfolgreich – Einheit landet exakt.");
        return zielFeld;
    } else {
        let fehllandefeld = berechneFehllandung(zielFeld);
        console.log(`Fehllandung! Statt ${zielFeld} landet Einheit auf ${fehllandefeld}.`);
        return fehllandefeld;
    }
}

// Führt den Zieltest durch (Basis 50%, modifizierbar durch z.B. Aufklärung)
function zieltest(gschwader) {
    let wurf = w20Modifiziert();
    return wurf >= 0;  // Standard: 50% Chance
}

// Berechnet Fehllandungsfeld im Umkreis von Ziel
function berechneFehllandung(zielFeld) {
    // Platzhalter: gibt ein Dummy-Feld zurück (echte Logik später)
    return "Zufallsnachbar_von_" + zielFeld;
}

// Prüft, ob Rückzug aus aktuellem Feld möglich ist (z. B. Dunkelwolken)
function pruefeRueckzugsmoeglichkeit(feld) {
    if (feld.typ === "dunkelwolke") {
        console.log("Rückzug nicht möglich: Feld ist Dunkelwolke.");
        return false;
    }
    return true;
}

// Würfelt einen modifizierten W20-Wurf mit ±10
function w20Modifiziert() {
    return Math.floor(Math.random() * 21) - 10; // ergibt Werte von -10 bis +10
}