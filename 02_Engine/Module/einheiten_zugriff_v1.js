/**
 * Zentrale Zugriffsfunktion für die Einheiten-Datenbank
 * Wird von KI und Modulen verwendet
 */

function ladeEinheit(datenbank, fraktion, typ, techlevel) {
    const einheit = datenbank?.[fraktion]?.[typ]?.[techlevel];
    if (!einheit) {
        console.warn(`Einheit nicht gefunden: ${fraktion} / ${typ} / ${techlevel}`);
        return null;
    }
    return einheit;
}