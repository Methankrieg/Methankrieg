/**
 * Gemeinsames Hilfsmodul für KI-Logik in "Der Methankrieg"
 * Beinhaltet standardisierte Regeln, Tests und Bewegungshilfen
 * Optionaler Zugriff auf Einheiten-Datenbank
 */

// Optional: Datenbank übergeben
let einheitenDatenbank = {};

function setzeEinheitenDatenbank(datenbank) {
    einheitenDatenbank = datenbank;
}

// Zugriff auf zentrale Einheit (optional)
function ladeEinheit(fraktion, typ, techlevel) {
    const einheit = einheitenDatenbank?.[fraktion]?.[typ]?.[techlevel];
    if (!einheit) {
        console.warn(`Einheit nicht gefunden: ${fraktion} / ${typ} / ${techlevel}`);
        return null;
    }
    return einheit;
}

// Prüfe Initiative in Reaktionsphase
function pruefeInitiative(gschwader) {
    let basiswert = (gschwader.fraktion === "arkoniden") ? 10 : 7;
    let qualitätsbonus = gschwader.qualitaetBonus || 0;
    let wurf = w20Modifiziert();
    let gesamt = basiswert + qualitätsbonus + wurf;
    console.log(`Initiativeprobe: Basis ${basiswert} + Bonus ${qualitätsbonus} + Wurf ${wurf} = ${gesamt}`);
    return gesamt > 10;
}

// Führe Transition durch
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

function zieltest(gschwader) {
    let wurf = w20Modifiziert();
    return wurf >= 0;
}

function berechneFehllandung(zielFeld) {
    return "Zufallsnachbar_von_" + zielFeld;
}

function pruefeRueckzugsmoeglichkeit(feld) {
    if (feld.typ === "dunkelwolke") {
        console.log("Rückzug nicht möglich: Feld ist Dunkelwolke.");
        return false;
    }
    return true;
}

function w20Modifiziert() {
    return Math.floor(Math.random() * 21) - 10;
}