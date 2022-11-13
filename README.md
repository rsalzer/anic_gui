# ANIC mit OpenAI

## Getting started
- Node / NPM installieren
- Im Terminal `npm install` ausführen
- Mittels `npm start dev` das GUI starten
- Im Browser die URL `localhost:5173` aufrufen (oder andere URL, die nach dem letzten Befehl im Terminal steht)
- OpenAI benötigt einen API-Key. Dieser kann auf der Webseite im Account generiert werden und kann im GUI direkt eingegeben werden.
- Aktuell können die Einstellungen von GPT-3 (Temperature, Frequency-Penalty etc.) nur direkt in `src/anic.js` geändert werden.

## TODOs
- OpenAI-Einstellungen (Temperature, Frequency-Penalty etc.) ins GUI integrieren
- ...

## Empfehlungen für Einstellungen:

### MKI (17.10.2022)
- model davinci
- temperature hoch, auf über 0.8, oder sogar auf 1
- frequency penalty >0.3, sonst wird es zu repetitiv. 1.89 hat sich bewährt. 2 wird dann vielleicht zu unsinnig (aber kommt auf die Kombination mit den anderen an?)
- presence penalty schätze 0.2 - 1.9
- best of hab ich immer auf 1 gelassen