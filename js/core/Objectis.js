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

    // Controllo esistenza metodo per evitare TypeError
    if (typeof Objectis.getPseudoCookie !== "function") {
        Objectis.logError("Warning: Storage.js non ancora caricato. Rinvio setEvents.");
        setTimeout(Objectis.setEvents, 50);
        return;
    }

    var var_o_pnl1 = document.getElementById("pnl-1");
    // Recupero iniziale dal registro DOM
    var var_n_saved = parseInt(Objectis.getPseudoCookie("click_count", "0"), 10);
    
    var var_o_btn1 = document.getElementById("btn-1");

    var var_n_saved = parseInt(Objectis.getPseudoCookie("click_count", "0"), 10);
    Objectis.var_o_data.var_n_clicks = var_n_saved;

    if (var_o_btn1) {
        var_o_btn1.onComponentClick = function() {
            Objectis.var_o_data.var_n_clicks++;
            
            // Salvataggio nello Pseudo-Cookie via JS
            Objectis.setPseudoCookie("click_count", Objectis.var_o_data.var_n_clicks);
            
            // Update UI
            if (var_o_pnl1) {
                Objectis.setContent(var_o_pnl1.getElementsByTagName("p")[0], 
                    "Dati registrati nel DOM: " + Objectis.var_o_data.var_n_clicks);
            }
        };
    }
};

Objectis.waitForCoreAndInit();