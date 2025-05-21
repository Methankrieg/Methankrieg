const gameState = {
  "runde": 4,
  "aktivePhase": 1,
  "aktiveFraktion": "arkoniden",
  "phaseDone": {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false
  },
  "einheiten": [],
  "admirale": [],
  "karte": {},
  "sektoren": {},
  "ziele": {
    "feldzug": "",
    "szenario": "umkaempftes_casyat",
    "aufgaben": [],
    "siegstatus": "offen"
  },
  "debugLog": [],
  "spielname": "Umkämpftes Casyat (Testaufstellung)",
  "letzterSpeicherzeitpunkt": null,
  "startaufstellung": [
    {
      "feld": "F-4307",
      "fraktion": "arkoniden",
      "einheit": "29. aufklärungsgeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 1
    },
    {
      "feld": "F-4110",
      "fraktion": "arkoniden",
      "einheit": "8. reservegeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-3909",
      "fraktion": "arkoniden",
      "einheit": "5. einsatzgeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-3909",
      "fraktion": "arkoniden",
      "einheit": "58. kreuzergeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 1
    },
    {
      "feld": "F-3611",
      "fraktion": "arkoniden",
      "einheit": "admiral_ruzik"
    },
    {
      "feld": "F-3611",
      "fraktion": "arkoniden",
      "einheit": "15. raumfortgeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 3
    },
    {
      "feld": "F-3611",
      "fraktion": "arkoniden",
      "einheit": "33. kreuzergeschwader",
      "qualitaet": "veteranen",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-3611",
      "fraktion": "arkoniden",
      "einheit": "19. reservegeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 1
    },
    {
      "feld": "F-3812",
      "fraktion": "arkoniden",
      "einheit": "8. aufklärungsgeschwader",
      "qualitaet": "veteranen",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-3812",
      "fraktion": "arkoniden",
      "einheit": "1. einsatzgeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 1
    },
    {
      "feld": "F-3812",
      "fraktion": "arkoniden",
      "einheit": "4. einsatzgeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 1
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "admiral_grek-18"
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "3. schlachtkreuzergeschwader",
      "qualitaet": "elite",
      "technologie": "state_of_the_art",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "26. schlachtkreuzergeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 1
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "20. liniengeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "10. aufklärungsgeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "10. leichtes trägergeschwader",
      "qualitaet": "grün",
      "technologie": "veraltet",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "19. kreuzergeschwader",
      "qualitaet": "veteranen",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "74. kreuzergeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 2
    },
    {
      "feld": "F-4112",
      "fraktion": "maahks",
      "einheit": "93. kreuzergeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 2
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "admiral_grek-48"
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "14. liniengeschwader",
      "qualitaet": "regulär",
      "technologie": "veraltet",
      "struktur": 2
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "20. schlachtkreuzergeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "12. aufklärungsgeschwader",
      "qualitaet": "regulär",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "25. kreuzergeschwader",
      "qualitaet": "veteranen",
      "technologie": "standard",
      "struktur": 2
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "184. kreuzergeschwader",
      "qualitaet": "grün",
      "technologie": "veraltet",
      "struktur": 1
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "185. kreuzergeschwader",
      "qualitaet": "grün",
      "technologie": "veraltet",
      "struktur": 1
    },
    {
      "feld": "F-4215",
      "fraktion": "maahks",
      "einheit": "186. kreuzergeschwader",
      "qualitaet": "grün",
      "technologie": "veraltet",
      "struktur": 1
    }
  ]
};