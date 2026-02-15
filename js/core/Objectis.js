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

Objectis.setEvents = function() {
    Objectis.trackCall("setEvents");

    var var_o_btn = document.getElementById("btn-1");
    if (var_o_btn) {
        var_o_btn.onComponentClick = function(O_DATA) {
            Objectis.logError("Controller: Ricevuto click da " + O_DATA.id);
            
            var var_o_pnl2 = document.getElementById("pnl-2");
            if (var_o_pnl2) {
                // Usiamo setStyle per coerenza con il framework
                Objectis.setStyle(var_o_pnl2, {
                    "display": "none",
                    "height": "0px",
                    "overflow": "hidden"
                });
                Objectis.logError("Azione: Pannello 2 rimosso via setStyle.");
            }
        };
    }
};

Objectis.waitForCoreAndInit();