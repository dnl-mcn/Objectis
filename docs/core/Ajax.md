# Objectis Ajax (v0.0.10)

Il modulo `Ajax` astrae la comunicazione asincrona con il server, garantendo il funzionamento su IE6 tramite il fallback sugli oggetti `ActiveX`.

## Metodi Disponibili

### Objectis.getXhr()

Ritorna l'oggetto di trasporto appropriato per il browser in uso. Gestisce internamente i diversi raggruppamenti di `Msxml2.XMLHTTP`.

### Objectis.ajaxLoad(S_URL, FN_CALLBACK)

Esegue una richiesta HTTP GET asincrona.

- **S_URL:** Indirizzo del file o dell'endpoint.
- **FN_CALLBACK:** Riceve come parametro la stringa `responseText`.

## Note sulla Sicurezza

A causa delle restrizioni di IE6, le richieste Ajax funzionano solo verso lo stesso dominio (Same-Origin Policy).
