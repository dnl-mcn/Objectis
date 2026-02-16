/**
 * @file Objectis.js
 * @description Inizializzatore globale con controllo dipendenze.
 * @version 0.1.9
 */
Objectis.init = function() {
    Objectis.trackCall("init");

    // Verifica dipendenze critiche
    if (!Objectis.setEvents || !Objectis.scanDocument || !Objectis.getTimestamp) {
        setTimeout(Objectis.init, 50);
        return;
    }

    // NUOVO: Attendiamo che il DOM sia caricato completamente (document.readyState)
    // Questo risolve il problema su Chrome e IE6
    if (document.readyState !== "complete") {
        setTimeout(Objectis.init, 50);
        return;
    }

    Objectis.logError("--- DOM Pronto: Avvio Scansione ---");

    // 1. Configurazione eventi globali
    Objectis.setEvents();

    // 2. Scansione effettiva
    Objectis.scanDocument();

    Objectis.logError("Framework pronto.");
};

/**
 * Avvio sicuro: invece di addEvent diretto, usiamo un check ciclico 
 * finché il modulo Events non è pronto.
 */
Objectis.waitForCoreAndInit = function() {
    if (typeof Objectis.addEvent === "function") {
        Objectis.addEvent(window, "load", function() {
            Objectis.init();
        });
    } else {
        setTimeout(Objectis.waitForCoreAndInit, 50);
    }
};

Objectis.activateComponent = function(O_EL, S_COMP_NAME, S_PATH) {
    Objectis.trackCall("activateComponent");

    if (Objectis[S_COMP_NAME]) {
        new Objectis[S_COMP_NAME](O_EL);
    } else {
        // Se non è già in coda, lo carichiamo
        if (!Objectis.var_o_registry[S_PATH]) {
            if (const_B_DEBUG) { Objectis.logError("In attesa di: " + S_PATH); }
            Objectis.loadModule(S_PATH);
        }
        // Riprova finché il costruttore non è disponibile
        setTimeout(function() {
            Objectis.activateComponent(O_EL, S_COMP_NAME, S_PATH);
        }, 50);
    }
};

// Store dei dati (Model)
Objectis.var_o_data = {
    var_s_user: "Ospite",
    var_n_clicks: 0
};

Objectis.setEvents = function() {
    Objectis.trackCall("setEvents");

    var var_o_btn1 = document.getElementById("btn-1");
    if (var_o_btn1) {
        var_o_btn1.onComponentClick = function(O_DATA) {
            try {
                // 1. Logica Dati
                Objectis.var_o_data.var_n_clicks++;
                
                // 2. Aggiornamento Pannello (Data Binding)
                var var_o_pnl1 = document.getElementById("pnl-1");
                if (var_o_pnl1) {
                    var var_s_msg = "Click totali: " + Objectis.var_o_data.var_n_clicks;
                    Objectis.setContent(var_o_pnl1.getElementsByTagName("p")[0], var_s_msg);
                }

                // 3. Reset del bottone tramite l'istanza dell'oggetto
                // Recuperiamo l'istanza dal registro (o la gestiamo via ID)
                this.innerHTML = "OPERAZIONE OK";
                
                // Delay minimo per mostrare il successo prima del reset
                setTimeout(function() {
                    var_o_btn1.innerHTML = Objectis.getParam(var_o_btn1, "obj-label", "Invia");
                }, 1000);

            } catch (var_o_err) {
                Objectis.logError("Errore nel controller: " + var_o_err.message);
                var_o_btn1.innerHTML = "ERRORE";
            }
        };
    }
};

Objectis.waitForCoreAndInit();