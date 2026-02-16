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

    Objectis.trackCall("setEvents");

    var var_o_btnUpdate = document.getElementById("btn-sync");
    if (var_o_btnUpdate) {
        var_o_btnUpdate.onComponentClick = function() {
            // Scarica i dati e aggiorna automaticamente tutti gli obj-bind="click_count"
            Objectis.ajaxToStorage("api/data.json", "click_count");
        };
    }

    var var_o_btnAjax = document.getElementById("btn-ajax");
    
    if (var_o_btnAjax) {
        var_o_btnAjax.onComponentClick = function() {
            this.innerHTML = "CARICAMENTO...";
            
            Objectis.ajax({
                url: "api/stats.json",
                success: function(var_o_res) {
                    // Aggiorniamo lo Pseudo-Cookie con il dato dal server
                    // Questo scatenerà automaticamente bindAll()
                    Objectis.setPseudoCookie("click_count", var_o_res.count);
                    
                    var_o_btnAjax.innerHTML = "DATI SINCRONIZZATI";
                },
                error: function(var_n_status) {
                    Objectis.logError("Errore AJAX: " + var_n_status);
                    var_o_btnAjax.innerHTML = "ERRORE SERVER";
                }
            });
        };
    }

    var var_o_debugLog = document.getElementById("obj-debug-log");
    if (var_o_debugLog) {
        var_o_debugLog.innerHTML += "<div style='margin-top:10px; border-top:1px solid #555; padding-top:5px;'>" + 
                                    Objectis.getDocumentation() + "</div>";
}
};

/**
 * @function getDocumentation
 * @description Genera un report dei componenti e dei metodi registrati.
 */
Objectis.getDocumentation = function() {
    Objectis.trackCall("getDocumentation");
    var var_s_html = "<h2>Documentazione Framework</h2><ul>";

    for (var var_s_key in Objectis) {
        if (typeof Objectis[var_s_key] === "function") {
            var_s_html += "<li><strong>Metodo:</strong> " + var_s_key + "()</li>";
        } else if (typeof Objectis[var_s_key] === "object") {
            var_s_html += "<li><strong>Modulo/Data:</strong> " + var_s_key + "</li>";
        }
    }

    var_s_html += "</ul>";
    return var_s_html;
};

Objectis.waitForCoreAndInit();