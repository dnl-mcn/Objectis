# Objectis BoxModel (v0.0.8)

Questo modulo gestisce la "geometria" degli elementi. È fondamentale per creare interfacce consistenti su IE6, dove il calcolo dei pixel può differire tra le diverse modalità di rendering.

## Metodi Disponibili

### Objectis.getRealWidth(O_EL)

Ritorna la larghezza totale occupata dall'elemento (`offsetWidth`), che include il contenuto, il padding e i bordi.

### Objectis.setSafeWidth(O_EL, N_TARGET_WIDTH)

Tenta di impostare la larghezza di un elemento in modo "sicuro". Nelle versioni future, questo metodo compenserà automaticamente le differenze tra `box-sizing: content-box` e `border-box`.

## Note Tecniche

L'uso di `offsetWidth` e `offsetHeight` è preferito rispetto al parsing delle stringhe CSS (`style.width`) perché i browser legacy ritornano spesso valori vuoti o non numerici tramite l'oggetto `style` se la dimensione è definita in un CSS esterno.
